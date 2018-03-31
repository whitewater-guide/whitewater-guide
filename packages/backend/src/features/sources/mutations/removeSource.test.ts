import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/04_sources';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { stopJobs } from '../../jobs';

let sourceCountBefore: number;
let translationsCountBefore: number;
let regionsConnectionCountBefore: number;

jest.mock('../../jobs', () => ({
  stopJobs: jest.fn(),
}));

beforeAll(async () => {
  const sourcesCnt = await db(true).table('sources').count().first();
  sourceCountBefore = Number(sourcesCnt.count);
  const translationsCnt = await db(true).table('sources_translations').count().first();
  translationsCountBefore = Number(translationsCnt.count);
  const regConnCnt = await db(true).table('sources_regions').count().first();
  regionsConnectionCountBefore = Number(regConnCnt.count);
});

const query = `
  mutation removeSource($id: ID!){
    removeSource(id: $id)
  }
`;

const galicia = { id: SOURCE_GALICIA_1 };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, galicia, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeSource', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, galicia, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeSource', null);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, galicia, adminContext());
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted source id', () => {
    expect(result.data.removeSource).toBe(galicia.id);
  });

  it('should remove from sources table', async () => {
    const { count } = await db().table('sources').count().first();
    expect(sourceCountBefore - Number(count)).toBe(1);
  });

  it('should remove from sources_translations table', async () => {
    const { count } = await db().table('sources_translations').count().first();
    expect(translationsCountBefore - Number(count)).toBe(2);
  });

  it('should remove sources -> regions connection', async () => {
    const { count } = await db().table('sources_regions').count().first();
    expect(regionsConnectionCountBefore - Number(count)).toBe(2);
  });

  it('should stop jobs', () => {
    expect(stopJobs).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });
});
