import { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/05_gauges';
import { fakeContext } from '../../../test/context';
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

test('should return gauge', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(EDITOR_NO_EC));
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data!.gauge)).toMatchSnapshot();
});

test('should return null when id not specified', async () => {
  const result = await runQuery(query, { }, fakeContext(EDITOR_NO_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge).toBeNull();
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Галисийская линейка 1');
});

test('should fall back to english when translation is not provided', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(EDITOR_NO_EC, 'fr'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Galicia gauge 1');
});

test('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, fakeContext(EDITOR_NO_EC, 'pt'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.url).toBe('http://ya.ru');
});

test.skip('it should return last level/flow/timestamp', () => {
});
