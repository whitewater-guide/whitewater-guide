import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

const galicia = { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, galicia, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeRegion).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, galicia, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeRegion).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, galicia, adminContext);
  });

  afterEach(() => {
    result = null;
  });

  test('should return deleted region id', () => {
    expect(result.data.removeRegion).toBe(galicia.id);
  });

  test('should remove from regions table', async () => {
    const count = await db().table('regions').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove from regions table', async () => {
    const count = await db().table('regions_translations').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove pois', async () => {
    const count = await db().table('points').count().first();
    const countLinks = await db().table('regions_points').count().first();
    const countTranslations = await db().table('points_translations').count().first();
    expect(count.count).toBe('1');
    expect(countLinks.count).toBe('0');
    expect(countTranslations.count).toBe('0');
  });
});
