import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN_ID, TEST_USER_ID } from '../../../seeds/test/01_users';
import { REGION_ECUADOR, REGION_GALICIA } from '../../../seeds/test/03_regions';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';

const query = `
  query regionEditors($regionId: ID!){
    regionEditors(regionId: $regionId) {
      id
      name
      email
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA };

  it('anon should fail', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(query, variables, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

  it('admin should fail', async () => {
    const result = await runQuery(query, variables, adminContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

});

describe('results', () => {
  it('should find one', async () => {
    const result = await runQuery(query, { regionId: REGION_GALICIA }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.regionEditors).toHaveLength(1);
    expect(result.data!.regionEditors).toMatchObject([{ id: ADMIN_ID }]);
  });

  it('should find many', async () => {
    const result = await runQuery(query, { regionId: REGION_ECUADOR }, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.regionEditors).toHaveLength(2);
    expect(result.data!.regionEditors).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: ADMIN_ID }),
      expect.objectContaining({ id: TEST_USER_ID }),
    ]));
  });
});
