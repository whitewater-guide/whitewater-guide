import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN_ID, SUPERADMIN_ID } from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/03_regions';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { countRows } from '../../../test/db-helpers';
import { runQuery } from '../../../test/runQuery';

let reBefore: number;

beforeAll(async () => {
  [reBefore] = await countRows(true, 'regions_editors');
});

const mutation = `
  mutation addEditor($regionId: ID!, $userId: ID!){
    addEditor(regionId: $regionId, userId: $userId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, userId: SUPERADMIN_ID };

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

  it('admin should fail', async () => {
    const result = await runQuery(mutation, variables, adminContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

});

describe('effects', () => {
  it('should increase count by one', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, userId: SUPERADMIN_ID }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.addEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(1);
  });

  it('should ignore dupes', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, userId: ADMIN_ID }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.addEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(0);
  });
});
