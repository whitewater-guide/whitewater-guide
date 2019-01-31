import { holdTransaction, rollbackTransaction } from '@db';
import { stopJobs } from '@features/jobs';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1 } from '@seeds/05_sources';
import { anonContext, countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

let sBefore: number;
let tBefore: number;
let rBefore: number;

jest.mock('@features/jobs', () => ({
  stopJobs: jest.fn(),
}));

beforeAll(async () => {
  [sBefore, tBefore, rBefore] = await countRows(
    true,
    'sources',
    'sources_translations',
    'sources_regions',
  );
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
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, galicia, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, galicia, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
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