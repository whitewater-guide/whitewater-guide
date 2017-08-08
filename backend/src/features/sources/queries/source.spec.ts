import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { Source } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sourceDetails($id: ID){
    source(id: $id) {
      id
      name
      url
      script
      harvestMode
      cron
      enabled
      createdAt
      updatedAt
    }
  }
`;

describe('anonymous', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, { id: 'b28f6394-6efa-11e7-8661-c72f46e0289f' }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('user', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, { id: 'b28f6394-6efa-11e7-8661-c72f46e0289f' }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('admin', () => {
  test('should return source', async () => {
    const result = await runQuery(query, { id: 'b28f6394-6efa-11e7-8661-c72f46e0289f' }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeTruthy();
    const source: Source = result.data!.source;
    expect(source.id).toBe('b28f6394-6efa-11e7-8661-c72f46e0289f');
    expect(noTimestamps(source)).toMatchSnapshot();
  });
});

describe('superadmin', () => {
  test('should return source', async () => {
    const result = await runQuery(query, { id: 'b28f6394-6efa-11e7-8661-c72f46e0289f' }, superAdminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    const source: Source = result.data!.source;
    expect(source.id).toBe('b28f6394-6efa-11e7-8661-c72f46e0289f');
    expect(noTimestamps(source)).toMatchSnapshot();
  });
});
