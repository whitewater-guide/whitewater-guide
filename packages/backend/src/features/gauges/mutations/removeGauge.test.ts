import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/05_sources';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/06_gauges';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows } from '../../../test/countRows';
import { runQuery } from '../../../test/db-helpers';
import { stopJobs } from '../../jobs';

jest.mock('../../jobs', () => ({
  stopJobs: jest.fn(),
}));

let pBefore: number;
let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  [pBefore, gBefore, tBefore] = await countRows(true, 'points', 'gauges', 'gauges_translations');
});

const query = `
  mutation removeGauge($id: ID!){
    removeGauge(id: $id)
  }
`;

const gal1 = { id: GAUGE_GAL_1_1 };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.data!.removeGauge).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.removeGauge).toBeNull();
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.removeGauge).toBeNull();
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, gal1, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted gauge id', () => {
    expect(result.data.removeGauge).toBe(gal1.id);
  });

  it('should remove from tables', async () => {
    const [pAfter, gAfter, tAfter] = await countRows(false, 'points', 'gauges', 'gauges_translations');
    expect([pAfter, gAfter, tAfter]).toEqual([
      pBefore - 1,
      gBefore - 1,
      tBefore - 2,
    ]);
  });

  it('sholud stop job when gauge is removed', () => {
    expect(stopJobs).toHaveBeenCalledWith(SOURCE_GALICIA_1, GAUGE_GAL_1_1);
  });
});
