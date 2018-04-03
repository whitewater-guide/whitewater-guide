import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/04_sources';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/05_gauges';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { stopJobs } from '../../jobs';

jest.mock('../../jobs', () => ({
  stopJobs: jest.fn(),
}));

let pointsBefore: number;
let gaugesBefore: number;
let translationsBefore: number;

beforeAll(async () => {
  const gCnt = await db(true).table('gauges').count().first();
  gaugesBefore = Number(gCnt.count);
  const tCnt = await db(true).table('gauges_translations').count().first();
  translationsBefore = Number(tCnt.count);
  const pCnt = await db(true).table('points').count().first();
  pointsBefore = Number(pCnt.count);
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
  test('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeGauge).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeGauge).toBeNull();
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
  });

  afterEach(() => {
    result = null;
  });

  test('should return deleted gauge id', () => {
    expect(result.data.removeGauge).toBe(gal1.id);
  });

  test('should remove from gauges table', async () => {
    const { count } = await db().table('gauges').count().first();
    expect(gaugesBefore - Number(count)).toBe(1);
  });

  test('should remove from translations table', async () => {
    const { count } = await db().table('gauges_translations').count().first();
    expect(translationsBefore - Number(count)).toBe(2);
  });

  test('should remove location point', async () => {
    const { count } = await db().table('points').count().first();
    expect(pointsBefore - Number(count)).toBe(1);
  });

  test('sholud stop job when gauge is removed', () => {
    expect(stopJobs).toHaveBeenCalledWith(SOURCE_GALICIA_1, GAUGE_GAL_1_1);
  });
});
