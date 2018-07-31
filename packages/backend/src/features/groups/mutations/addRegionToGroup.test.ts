import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { GROUP_EMPTY, GROUP_EU } from '@seeds/03_groups';
import { REGION_GALICIA } from '@seeds/04_regions';
import { anonContext, countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@ww-commons';

let rgBefore: number;

beforeAll(async () => {
  [rgBefore] = await countRows(true, 'regions_groups');
});

const mutation = `
  mutation addRegionToGroup($regionId: ID!, $groupId: ID!){
    addRegionToGroup(regionId: $regionId, groupId: $groupId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, groupId: GROUP_EMPTY };

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('group should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

});

describe('effects', () => {
  it('should increase count by one', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, groupId: GROUP_EMPTY }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.addRegionToGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(1);
  });

  it('should ignore dupes', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, groupId: GROUP_EU }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.addRegionToGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(0);
  });
});
