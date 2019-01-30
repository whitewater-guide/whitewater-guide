import db, { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_NORWAY } from '@seeds/05_sources';
import { anonContext, fakeContext, noTimestamps, runQuery } from '@test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listGauges($sourceId: ID, $page: Page) {
  gauges(sourceId: $sourceId, page: $page) {
    nodes {
      id
      name
      code
      location {
        id
        coordinates
      }
      levelUnit
      flowUnit
      requestParams
      cron
      url
      enabled
      createdAt
      updatedAt
      source {
        id
        name
        harvestMode
      }
    }
    count
  }
}
`;

describe('resolvers chain', () => {
  it('anon should not see cron and request params', async () => {
    const result = await runQuery(query, undefined, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauges.nodes[0]).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });

  it('user should not see cron and request params', async () => {
    const result = await runQuery(query, undefined, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauges.nodes[0]).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });

  it('editor should not see cron and request params', async () => {
    const result = await runQuery(query, undefined, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauges.nodes[0]).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });
});

it('should return gauges', async () => {
  const result = await runQuery(query, undefined, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.gauges).toBeDefined();
  expect(result.data!.gauges.count).toBe(12);
  expect(result.data!.gauges.nodes.map(noTimestamps)).toMatchSnapshot();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(12);
  const names = result.data!.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Галисийская линейка 1']));
});

it('should fall back to english', async () => {
  const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(12);
  const names = result.data!.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Georgian gauge 3']));
});

it('should be able to specify source id', async () => {
  const result = await runQuery(
    query,
    { sourceId: SOURCE_NORWAY },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(4);
  expect(result.data!.gauges.nodes[0].code).toBe('nor1');
});

it('should paginate', async () => {
  const result = await runQuery(
    query,
    { sourceId: SOURCE_NORWAY, page: { limit: 1, offset: 1 } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(4);
  expect(result.data!.gauges.nodes).toHaveLength(1);
  expect(result.data!.gauges.nodes[0].code).toBe('nor2');
});

it('should fire two queries', async () => {
  const queryMock = jest.fn();
  db().on('query', queryMock);
  await runQuery(query, { sourceId: SOURCE_NORWAY }, fakeContext(ADMIN));
  db().removeListener('query', queryMock);
  expect(queryMock).toHaveBeenCalledTimes(2);
});
