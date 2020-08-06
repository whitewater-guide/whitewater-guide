import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { holdTransaction, rollbackTransaction } from '~/db';
import { EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import {
  GALICIA_BECA_LOWER,
  GALICIA_BECA_UPPER,
  NORWAY_FINNA_GORGE,
  NORWAY_SJOA_AMOT,
} from '~/seeds/test/09_sections';
import { anonContext, countRows, fakeContext, runQuery } from '~/test';

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

const query = `
  mutation mergeSections($sourceId: ID!, $destinationId: ID!){
    mergeSections(sourceId: $sourceId, destinationId: $destinationId)
  }
`;

const id = GALICIA_BECA_LOWER; // Galicia River 1 Section 1

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(
      query,
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      query,
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(
      query,
      { sourceId: NORWAY_SJOA_AMOT, destinationId: NORWAY_FINNA_GORGE },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

it('should reparent pois, media and descents', async () => {
  const result = await runQuery(
    query,
    { sourceId: GALICIA_BECA_LOWER, destinationId: GALICIA_BECA_UPPER },
    fakeContext(EDITOR_GA_EC),
  );
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
