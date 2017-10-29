import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { toggleGaugeQuery } from './toggleGauge';

const query = `
  mutation toggleGauge($id: ID!, $enabled: Boolean!){
    toggleGauge(id: $id, enabled: $enabled) {
      id
      language
      enabled
    }
  }
`;

const gal1 = { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', enabled: true };
const nor1 = { id: 'c03184b4-aaa0-11e7-abc4-cec278b6b50a', enabled: false };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, gal1, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
  });
});

describe('effects', () => {
  it('should enable', async () => {
    const result = await runQuery(query, gal1, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      ...gal1,
      language: 'en',
    });
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor1, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      ...nor1,
      language: 'en',
    });
  });
});

describe('sql', () => {
  test('should use correct query', () => {
    expect(toggleGaugeQuery(gal1)).toMatchSnapshot();
  });
});
