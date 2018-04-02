import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN_ID, SUPERADMIN_ID } from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/03_regions';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { countRows } from '../../../test/db-helpers';
import { runQuery } from '../../../test/runQuery';

const mutation = `
  mutation administrateRegion($regionId: ID!, $settings: RegionAdminSettings!){
    administrateRegion(regionId: $regionId, settings: $settings) {
      id
      hidden
      premium
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const variables = { regionId: REGION_GALICIA, settings: { hidden: true, premium: true } };

describe('resolvers chain', () => {

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, userContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

  it('admin should fail', async () => {
    const result = await runQuery(mutation, variables, adminContext());
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.administrateRegion', null);
  });

});

describe('result', () => {
  it('should return result', async () => {
    const result = await runQuery(mutation, variables, superAdminContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.administrateRegion).toMatchObject({
      id: REGION_GALICIA,
      hidden: true,
      premium: true,
    });
  });

});
