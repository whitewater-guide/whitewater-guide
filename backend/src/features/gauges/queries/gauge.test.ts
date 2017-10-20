import { holdTransaction, rollbackTransaction } from '../../../db';
import { userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query gaugeDetails($id: ID, $language: String){
    gauge(id: $id, language: $language) {
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
        language
        name
        script
        harvestMode
      }
    }
  }
`;

test('should return gauge', async () => {
  const result = await runQuery(query, { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a' }, userContext);
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data!.gauge)).toMatchSnapshot();
});

test('should return null when id not specified', async () => {
  const result = await runQuery(query, { }, userContext);
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge).toBeNull();
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', language: 'ru' }, userContext);
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Галисийская линейка 1');
});

test('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', language: 'pt' }, userContext);
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.name).toBe('Gauge gal1');
  expect(result.data!.gauge.url).toBe('http://ya.ru');
});

test.skip('it should return location', () => {
});

test.skip('it should return last level/flow/timestamp', () => {
});
