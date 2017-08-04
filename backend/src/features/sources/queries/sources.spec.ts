import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { SourceRaw } from '../types';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
{
  sources {
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

test('sanity test', async () => {
  const source = await db().table('sources').first();
  expect(source).toBeDefined();
});

describe('anonymous', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, undefined, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeNull();
    // expect(result.data).toBeDefined();
    // expect(result.data!.sources).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('user', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, undefined, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeNull();
    // expect(result.data).toBeDefined();
    // expect(result.data!.sources).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('admin', () => {
  test('should list sources', async () => {
    const result = await runQuery(query, undefined, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.sources).toBeDefined();
    const sources: SourceRaw[] = result.data!.sources;
    expect(sources.length).toBe(2);
    expect(sources[0].id).toBeDefined();
    const snapshot = sources.map(noTimestamps);
    expect(snapshot).toMatchSnapshot();
  });
});

describe('super admin', () => {
  test('should list sources', async () => {
    const result = await runQuery(query, undefined, superAdminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.sources).toBeDefined();
    const sources: SourceRaw[] = result.data!.sources;
    expect(sources.length).toBe(2);
    expect(sources[0].id).toBeDefined();
    const snapshot = sources.map(noTimestamps);
    expect(snapshot).toMatchSnapshot();
  });
});
