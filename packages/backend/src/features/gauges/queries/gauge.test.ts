import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/05_gauges';
import { anonContext, fakeContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query gaugeDetails($id: ID){
    gauge(id: $id) {
      id
      name
      code
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
        script
        harvestMode
      }
      location {
        id
        coordinates
      }
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not see cron and request params', async () => {
    const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });

  it('user should not see cron and request params', async () => {
    const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });

  it('editor should not see cron and request params', async () => {
    const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
      cron: null,
    });
  });
});

it('should return gauge', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data!.gauge)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query, { }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(ADMIN, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Галисийская линейка 1');
});

it('should fall back to english when translation is not provided', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(ADMIN, 'fr'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Galicia gauge 1');
});

it('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(ADMIN, 'pt'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.url).toBe('http://ya.ru');
});

it.skip('it should return last level/flow/timestamp', () => {
});
