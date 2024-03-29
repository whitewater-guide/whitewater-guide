import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  TEST_USER,
} from '../../../seeds/test/01_users';
import { GROUP_EU } from '../../../seeds/test/03_groups';
import { REGION_ECUADOR, REGION_GALICIA } from '../../../seeds/test/04_regions';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import { testRemoveRegionFromGroup } from './removeRegionFromGroup.test.generated';

let rgBefore: number;

beforeAll(async () => {
  [rgBefore] = await countRows(true, 'regions_groups');
});

const _mutation = gql`
  mutation removeRegionFromGroup($regionId: ID!, $groupId: ID!) {
    removeRegionFromGroup(regionId: $regionId, groupId: $groupId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, groupId: EDITOR_GA_EC_ID };

  it('anon should fail', async () => {
    const result = await testRemoveRegionFromGroup(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('group should fail', async () => {
    const result = await testRemoveRegionFromGroup(
      variables,
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await testRemoveRegionFromGroup(
      variables,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  it('should decrease count by one', async () => {
    const result = await testRemoveRegionFromGroup(
      { regionId: REGION_GALICIA, groupId: GROUP_EU },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeRegionFromGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(-1);
  });

  it('should ignore attempts to remove non-existing regions', async () => {
    const result = await testRemoveRegionFromGroup(
      { regionId: REGION_ECUADOR, groupId: GROUP_EU },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeRegionFromGroup).toBe(true);
    const [rgAfter] = await countRows(false, 'regions_groups');
    expect(rgAfter - rgBefore).toBe(0);
  });
});
