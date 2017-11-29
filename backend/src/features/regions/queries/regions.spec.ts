import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listRegions($language: String, $page: Page){
    regions(language: $language, page: $page) {
      nodes {
        id
        language
        name
        description
        season
        seasonNumeric
        bounds
        hidden
        createdAt
        updatedAt
        pois {
          id
          language
          name
          description
          kind
          coordinates
        }
      }
      count
    }
  }
`;

test('should return regions', async () => {
  const result = await runQuery(query, undefined, superAdminContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  expect(regions.nodes.length).toBe(3);
  expect(regions.nodes.map(noTimestamps)).toMatchSnapshot();
});

test('users should not see hidden regions', async () => {
  const result = await runQuery(query, undefined, userContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(2);
  expect(regions.nodes[0].hidden).toBe(null);
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, { language: 'ru' }, superAdminContext);
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  // Check name
  expect(regions.nodes[2].name).toBe('Галисия');
  // Check name & common attribute for non-translated region
  expect(regions.nodes[1].name).toBe('Not translated');
  expect(regions.nodes[1].hidden).toBe(true);
});

test('should return rivers count', async () => {
  const riversQuery = `
    query listRegions($language: String, $page: Page){
      regions(language: $language, page: $page) {
        nodes {
          id
          language
          name
          rivers { count }
        }
        count
      }
    }
  `;
  const result = await runQuery(riversQuery, {}, superAdminContext);
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  // Check name
  expect(regions.nodes[0].rivers).toEqual({ count: 0 });
  expect(regions.nodes[1].rivers).toEqual({ count: 2 });
  expect(regions.nodes[2].rivers).toEqual({ count: 2 });
});

test('should return gauges count', async () => {
  const gaugesQuery = `
    query listRegions($language: String, $page: Page){
      regions(language: $language, page: $page) {
        nodes {
          id
          language
          name
          gauges { count }
        }
        count
      }
    }
  `;
  const result = await runQuery(gaugesQuery, {}, superAdminContext);
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  // Check name
  expect(regions.nodes[0].gauges).toEqual({ count: 0 }); // Ecuador
  expect(regions.nodes[1].gauges).toEqual({ count: 2 }); // galicia
  expect(regions.nodes[2].gauges).toEqual({ count: 4 }); // Norway
});
