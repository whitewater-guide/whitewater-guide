import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_GA_EC_ID, TEST_USER } from '../../../seeds/test/01_users';
import { GROUP_EU } from '../../../seeds/test/03_groups';
import { REGION_ECUADOR, REGION_GALICIA } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows } from '../../../test/db-helpers';
import { runQuery } from '../../../test/runQuery';

let rgBefore: number;

beforeAll(async () => {
  [rgBefore] = await countRows(true, 'regions_groups');
});

const mutation = `
  mutation removeRegionFromGroup($regionId: ID!, $groupId: ID!){
    removeRegionFromGroup(regionId: $regionId, groupId: $groupId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, groupId: EDITOR_GA_EC_ID };

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeRegionFromGroup', null);
  });

  it('group should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeRegionFromGroup', null);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeRegionFromGroup', null);
  });

});

describe('effects', () => {
  it('should decrease count by one', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, groupId: GROUP_EU }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.removeRegionFromGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(-1);
  });

  it('should ignore attempts to remove non-existing regions', async () => {
    const result = await runQuery(mutation, { regionId: REGION_ECUADOR, groupId: GROUP_EU }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.removeRegionFromGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(0);
  });
});
