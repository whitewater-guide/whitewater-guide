import { holdTransaction, rollbackTransaction } from '@db';
import { stopJobs } from '@features/jobs';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1 } from '@seeds/05_sources';
import { GAUGE_GAL_1_1, GAUGE_GAL_1_2 } from '@seeds/06_gauges';
import { anonContext, countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

jest.mock('@features/jobs', () => ({
  stopJobs: jest.fn(),
}));

let pBefore: number;
let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  [pBefore, gBefore, tBefore] = await countRows(
    true,
    'points',
    'gauges',
    'gauges_translations',
  );
});

const mutation = `
  mutation removeGauges($sourceId: ID!){
    removeGauges(sourceId: $sourceId)
  }
`;
const DATA_FIELD = 'removeGauges';

const vars = { sourceId: SOURCE_GALICIA_1 };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, vars, anonContext());
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.UNAUTHENTICATED,
      DATA_FIELD,
    );
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(mutation, vars, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted gauges ids', () => {
    expect(result.data.removeGauges).toEqual(
      expect.arrayContaining([GAUGE_GAL_1_1, GAUGE_GAL_1_2]),
    );
  });

  it('should remove from tables', async () => {
    const [pAfter, gAfter, tAfter] = await countRows(
      false,
      'points',
      'gauges',
      'gauges_translations',
    );
    expect([pAfter, gAfter, tAfter]).toEqual([
      pBefore - 1,
      gBefore - 2,
      tBefore - 4,
    ]);
  });

  it('should stop jobs', () => {
    expect(stopJobs).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });
});
