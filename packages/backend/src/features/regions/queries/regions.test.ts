import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listRegions($page: Page){
    regions(page: $page) {
      nodes {
        id
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

it('should return regions', async () => {
  const result = await runQuery(query, undefined, superAdminContext());
  expect(result.errors).toBeUndefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  expect(regions.nodes.length).toBe(3);
  expect(regions.nodes.map(noTimestamps)).toMatchSnapshot();
});

it('users should not see hidden regions', async () => {
  const result = await runQuery(query, { }, userContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(2);
  expect(regions.nodes[0].hidden).toBe(null);
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { }, superAdminContext('ru'));
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  expect(regions.nodes).toContainEqual(expect.objectContaining({ name: 'Галисия' }));
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, { }, superAdminContext('ru'));
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  expect(regions.nodes).toContainEqual(expect.objectContaining({ name: 'Norway' }));
});

it('should return rivers count', async () => {
  const riversQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          rivers { count }
        }
        count
      }
    }
  `;
  const result = await runQuery(riversQuery, {}, superAdminContext());
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.count).toBe(3);
  // Check name
  expect(regions.nodes[0].rivers).toEqual({ count: 0 });
  expect(regions.nodes[1].rivers).toEqual({ count: 2 });
  expect(regions.nodes[2].rivers).toEqual({ count: 2 });
});

it('should return gauges count', async () => {
  const gaugesQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          gauges { count }
        }
        count
      }
    }
  `;
  const result = await runQuery(gaugesQuery, {}, superAdminContext());
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  // Check name
  // connects sources 'galicia' and 'norway' to region 'Norway'
  // connects sources 'galicia' and 'galicia2' to region 'galicia'
  expect(regions.nodes[0].gauges).toEqual({ count: 0 }); // Ecuador
  expect(regions.nodes[1].gauges).toEqual({ count: 4 }); // galicia
  expect(regions.nodes[2].gauges).toEqual({ count: 6 }); // Norway
});

it('should return sections count', async () => {
  const gaugesQuery = `
    query listRegions($page: Page){
      regions(page: $page) {
        nodes {
          id
          name
          sections { count }
        }
        count
      }
    }
  `;
  const result = await runQuery(gaugesQuery, {}, superAdminContext());
  expect(result.errors).toBeUndefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions.nodes;
  // At least one region should have some sections
  expect(regions.some((r: any) => r.sections.count > 0)).toBe(true);
});
