import { anonContext, countRows, fakeContext, UUID_REGEX } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction, Sql } from '~/db';
import { GorgeConnector } from '~/features/gorge';
import {
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO_EC,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_GALICIA } from '~/seeds/test/04_regions';
import { SOURCE_GALICIA_1 } from '~/seeds/test/05_sources';
import { RIVER_FINNA, RIVER_GAL_BECA } from '~/seeds/test/07_rivers';
import {
  GALICIA_BECA_LOWER,
  NORWAY_FINNA_GORGE,
} from '~/seeds/test/09_sections';

import { testRemoveSection } from './removeSection.test.generated';

jest.mock('../../gorge/connector');

let sBefore: number;
let pBefore: number;
let spBefore: number;
let tBefore: number;

beforeAll(async () => {
  [sBefore, tBefore, pBefore, spBefore] = await countRows(
    true,
    'sections',
    'sections_translations',
    'points',
    'sections_points',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation removeSection($id: ID!) {
    removeSection(id: $id)
  }
`;

const id = GALICIA_BECA_LOWER; // Galicia River 1 Section 1

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testRemoveSection({ id }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testRemoveSection({ id }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await testRemoveSection({ id }, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  let result: any;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    spy = jest.spyOn(GorgeConnector.prototype, 'updateJobForSource');
    result = await testRemoveSection({ id }, fakeContext(EDITOR_GA_EC));
  });

  afterEach(() => {
    spy.mockReset();
  });

  it('should return delete section id', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('removeSection', id);
  });

  it('should remove section and translation', async () => {
    const [sections, translations] = await countRows(
      false,
      'sections',
      'sections_translations',
    );
    expect([sBefore - sections, tBefore - translations]).toEqual([1, 2]);
  });

  it('should remove points', async () => {
    const [pAfter, spAfter] = await countRows(
      false,
      'points',
      'sections_points',
    );
    expect([pBefore - pAfter, spBefore - spAfter]).toEqual([2, 2]);
  });

  it('should log this event', async () => {
    const entry: Sql.SectionsEditLog = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: id,
      section_name: 'Lower',
      river_id: RIVER_GAL_BECA,
      river_name: 'Beca',
      region_id: REGION_GALICIA,
      region_name: 'Galicia',
      editor_id: EDITOR_GA_EC_ID,
      action: 'delete',
      diff: null,
      created_at: expect.any(Date),
    });
  });

  it('should update gorge job for source', async () => {
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });

  it('should not remove river when one of many sections is deleted', async () => {
    const { count } = await db(false)
      .table('rivers')
      .count('*')
      .where({ id: RIVER_GAL_BECA })
      .first();
    expect(count).toBe('1');
  });

  it.todo('should remove media');
});

it('should also remove river if this was the only section on the river', async () => {
  await testRemoveSection({ id: NORWAY_FINNA_GORGE }, fakeContext(ADMIN));
  const { count } = await db(false)
    .table('rivers')
    .count('*')
    .where({ id: RIVER_FINNA })
    .first();
  expect(count).toBe('0');
});
