import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  TEST_USER,
} from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/04_regions';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import { testRemoveEditor } from './removeEditor.test.generated';

let reBefore: number;

beforeAll(async () => {
  [reBefore] = await countRows(true, 'regions_editors');
});

const _mutation = gql`
  mutation removeEditor($regionId: ID!, $userId: ID!) {
    removeEditor(regionId: $regionId, userId: $userId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, userId: EDITOR_GA_EC_ID };

  it('anon should fail', async () => {
    const result = await testRemoveEditor(variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should fail', async () => {
    const result = await testRemoveEditor(variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should fail', async () => {
    const result = await testRemoveEditor(variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  it('should decrease count by one', async () => {
    const result = await testRemoveEditor(
      { regionId: REGION_GALICIA, userId: EDITOR_GA_EC_ID },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(-1);
  });

  it('should ignore attempts to remove non-existing editors', async () => {
    const result = await testRemoveEditor(
      { regionId: REGION_GALICIA, userId: ADMIN_ID },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(0);
  });
});
