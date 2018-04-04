import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/04_sources';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows } from '../../../test/countRows';
import { runQuery } from '../../../test/db-helpers';
import { stopJobs } from '../../jobs';

let sBefore: number;
let tBefore: number;
let rBefore: number;

jest.mock('../../jobs', () => ({
  stopJobs: jest.fn(),
}));

beforeAll(async () => {
  [sBefore, tBefore, rBefore] = await countRows(true, 'sources', 'sources_translations', 'sources_regions');
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
    const result = await runQuery(query, galicia, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeSource', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, galicia, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeSource', null);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, galicia, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted source id', () => {
    expect(result.data.removeSource).toBe(galicia.id);
  });

  it('should remove from sources table', async () => {
    const [sources] = await countRows(false, 'sources');
    expect(sBefore - sources).toBe(1);
  });

  it('should remove from sources_translations table', async () => {
    const [translations] = await countRows(false, 'sources_translations');
    expect(tBefore - translations).toBe(2);
  });

  it('should remove sources -> regions connection', async () => {
    const [regions] = await countRows(false, 'sources_regions');
    expect(rBefore - regions).toBe(2);
  });

  it('should stop jobs', () => {
    expect(stopJobs).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });
});
