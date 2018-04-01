import db from '../../../db';
import { holdTransaction, rollbackTransaction } from '../../../db';
import { SOURCE_NORWAY } from '../../../seeds/test/04_sources';
import { superAdminContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listGauges($sourceId: ID) {
  gauges(sourceId: $sourceId) {
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

test('should return gauges', async () => {
  const result = await runQuery(query, undefined, superAdminContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.gauges).toBeDefined();
  expect(result.data!.gauges.count).toBe(12);
  expect(result.data!.gauges.nodes.map(noTimestamps)).toMatchSnapshot();
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, {}, superAdminContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(12);
  const names = result.data!.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Галисийская линейка 1']));
});

test('should fall back to english', async () => {
  const result = await runQuery(query, {}, superAdminContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges.count).toBe(12);
  const names = result.data!.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Georgian gauge 3']));
});

test('should be able to specify source id', async () => {
  const result = await runQuery(query, { sourceId: SOURCE_NORWAY }, superAdminContext());
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauges).toBeDefined();
  expect(result.data!.gauges.count).toBe(4);
  expect(result.data!.gauges.nodes[0].code).toBe('nor1');
});
