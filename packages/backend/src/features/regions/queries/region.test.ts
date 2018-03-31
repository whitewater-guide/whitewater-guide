import { holdTransaction, rollbackTransaction } from '../../../db';
import { REGION_GALICIA } from '../../../seeds/test/03_regions';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query regionDetails($id: ID){
    region(id: $id) {
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
  }
`;

test('should return region', async () => {
  const result = await runQuery(query, { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' }, superAdminContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.region).toBeDefined();
  const region = result.data!.region;
  expect(region.hidden).not.toBeNull();
  expect(noTimestamps(region)).toMatchSnapshot();
});

test('should return null when id not specified', async () => {
  const result = await runQuery(query, {}, superAdminContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.region).toBeNull();
});

test('users should not see hidden region', async () => {
  const result = await runQuery(query, { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' }, userContext());
  expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
  expect(result).toHaveProperty('data.region', null);
});

test('should be able to specify language', async () => {
  const result = await runQuery(
    query,
    { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' },
    userContext('ru'),
  );
  expect(result.data!.region.name).toBe('Галисия');
});

test('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(
    query,
    { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' },
    userContext('pt'),
  );
  expect(result.data!.region.name).toBe('Not translated');
  expect(result.data!.region.seasonNumeric).toEqual([20, 21]);
});

test('should get rivers', async () => {
  const riversQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        rivers {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
  const result = await runQuery(riversQuery, { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' }, userContext());
  expect(result.data!.region.rivers).toMatchSnapshot();
});

test('should get gauges', async () => {
  const gaugesQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        gauges {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
  // Norway
  const result = await runQuery(gaugesQuery, { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' }, userContext());
  expect(result.data!.region.gauges.count).toEqual(6);
  expect(result.data!.region.gauges).toMatchSnapshot();
});

test('should get sections', async () => {
  const sectionsQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        sections {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
  // No pagination yet
  const result = await runQuery(sectionsQuery, { id: REGION_GALICIA }, userContext());
  expect(result.data!.region.sections.count).toEqual(2);
  expect(result.data!.region.sections).toMatchSnapshot();
});
