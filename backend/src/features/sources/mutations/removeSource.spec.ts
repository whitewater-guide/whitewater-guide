import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeSource($id: ID!){
    removeSource(id: $id)
  }
`;

const galicia = { id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a' };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, galicia, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeSource).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, galicia, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeSource).toBeNull();
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

  test('should return deleted source id', () => {
    expect(result.data.removeSource).toBe(galicia.id);
  });

  test('should remove from sources table', async () => {
    const count = await db().table('sources').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove from sources_translations table', async () => {
    const count = await db().table('sources_translations').count().first();
    expect(count.count).toBe('2');
  });

  test('should remove sources -> regions connection', async () => {
    const count = await db().table('sources_regions').count().where({ source_id: galicia.id }).first();
    expect(count.count).toBe('0');
  });
});
