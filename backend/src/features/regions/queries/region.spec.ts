import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query regionDetails($id: ID, $language: String){
    region(id: $id, language: $language) {
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
  const result = await runQuery(query, { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' }, superAdminContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.region).toBeDefined();
  const region = result.data!.region;
  expect(region.hidden).not.toBeNull();
  expect(noTimestamps(region)).toMatchSnapshot();
});

test('users should not see hidden region', async () => {
  const result = await runQuery(query, { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' }, userContext);
  expect(result.errors).toBeDefined();
  expect(result.data).toBeDefined();
  expect(result.data!.region).toBeNull();
  expect(result).toMatchSnapshot();
});

test('should be able to specify language', async () => {
  const result = await runQuery(
    query,
    { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', language: 'ru' },
    userContext,
  );
  expect(result.data!.region.name).toBe('Галисия');
});

test('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(
    query,
    { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', language: 'pt' },
    userContext,
  );
  expect(result.data!.region.name).toBe('Not translated');
  expect(result.data!.region.seasonNumeric).toEqual([20, 21]);
});
