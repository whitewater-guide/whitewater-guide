import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  {
    regions {
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

test('should return regions', async () => {
  const result = await runQuery(query, undefined, superAdminContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.length).toBe(3);
  expect(regions.map(noTimestamps)).toMatchSnapshot();
});

test('users should not see hidden regions', async () => {
  const result = await runQuery(query, undefined, userContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.regions).toBeDefined();
  const regions = result.data!.regions;
  expect(regions.length).toBe(2);
  expect(regions[0].hidden).toBe(null);
});
