import { holdTransaction, rollbackTransaction } from '../../../db';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/05_gauges';
import { userContext } from '../../../test/context';
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
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, userContext());
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data!.gauge)).toMatchSnapshot();
});

test('should return null when id not specified', async () => {
  const result = await runQuery(query, { }, userContext());
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge).toBeNull();
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, userContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Галисийская линейка 1');
});

test('should fall back to english when translation is not provided', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, userContext('fr'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Galicia gauge 1');
});

test('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, userContext('pt'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.url).toBe('http://ya.ru');
});

test.skip('it should return last level/flow/timestamp', () => {
});
