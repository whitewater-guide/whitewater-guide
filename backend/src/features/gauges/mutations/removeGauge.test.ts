import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { removeGaugeQuery } from './removeGauge';

const query = `
  mutation removeGauge($id: ID!){
    removeGauge(id: $id)
  }
`;

const gal1 = { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a' };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeGauge).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, gal1, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeGauge).toBeNull();
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, gal1, adminContext);
  });

  afterEach(() => {
    result = null;
  });

  test('should return deleted gauge id', () => {
    expect(result.data.removeGauge).toBe(gal1.id);
  });

  test('should remove from gauges table', async () => {
    const count = await db().table('gauges').count().first();
    expect(count.count).toBe('3');
  });

  test('should remove from translations table', async () => {
    const count = await db().table('gauges_translations').count().first();
    expect(count.count).toBe('4');
  });

  test('should remove location', async () => {

  });
});

describe('sql', () => {
  test('should use correct query', () => {
    expect(removeGaugeQuery(gal1)).toMatchSnapshot();
  });
});
