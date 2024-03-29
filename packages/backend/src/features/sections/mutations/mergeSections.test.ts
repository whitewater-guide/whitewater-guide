import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import type { Sql } from '../../../db/index';
import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  TEST_USER,
} from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/04_regions';
import { RIVER_GAL_BECA } from '../../../seeds/test/07_rivers';
import {
  GALICIA_BECA_LOWER,
  GALICIA_BECA_UPPER,
  NORWAY_FINNA_GORGE,
  NORWAY_SJOA_AMOT,
} from '../../../seeds/test/09_sections';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import { UUID_REGEX } from '../../../utils/index';
import type { MergeSectionsMutationResult } from './mergeSections.test.generated';
import { testMergeSections } from './mergeSections.test.generated';

let sBefore: number;
let pBefore: number;
let mBefore: number;
let dBefore: number;

beforeAll(async () => {
  [sBefore, pBefore, mBefore, dBefore] = await countRows(
    true,
    'sections',
    'points',
    'media',
    'descents',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation mergeSections($sourceId: ID!, $destinationId: ID!) {
    mergeSections(sourceId: $sourceId, destinationId: $destinationId)
  }
`;

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testMergeSections(
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testMergeSections(
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await testMergeSections(
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  let result: MergeSectionsMutationResult;

  beforeEach(async () => {
    result = await testMergeSections(
      { sourceId: GALICIA_BECA_LOWER, destinationId: GALICIA_BECA_UPPER },
      fakeContext(EDITOR_GA_EC),
    );
  });

  it('should reparent pois, media and descents', async () => {
    expect(result.errors).toBeUndefined();
    const [sAfter, pAfter, mAfter, dAfter] = await countRows(
      false,
      'sections',
      'points',
      'media',
      'descents',
    );
    expect([
      sAfter - sBefore,
      pAfter - pBefore,
      mAfter - mBefore,
      dAfter - dBefore,
    ]).toEqual([-1, 0, 0, 0]);
  });

  it('should log this event', async () => {
    const entry: Sql.SectionsEditLog = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: GALICIA_BECA_UPPER,
      section_name: 'Upper',
      river_id: RIVER_GAL_BECA,
      river_name: 'Beca',
      region_id: REGION_GALICIA,
      region_name: 'Galicia',
      editor_id: EDITOR_GA_EC_ID,
      action: 'merged',
      diff: expect.objectContaining({ id: [GALICIA_BECA_LOWER, 0, 0] }),
      created_at: expect.any(Date),
    });
  });
});
