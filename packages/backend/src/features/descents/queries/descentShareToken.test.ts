import { fakeContext } from '@test';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER, TEST_USER2 } from '~/seeds/test/01_users';
import { DESCENT_02, DESCENT_2_SHARE_TOKEN } from '~/seeds/test/18_descents';

import { testGetShareToken } from './descentShareToken.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query getShareToken($id: ID!) {
    descentShareToken(id: $id)
  }
`;

type PermissionsTestCase = [string, any];

it.each<PermissionsTestCase>([
  ['anon', undefined],
  ['non-owner', TEST_USER2],
])('%s should not get share token', async (_, user) => {
  const result = await testGetShareToken({ id: DESCENT_02 }, fakeContext(user));
  expect(result.errors).toBeTruthy();
  expect(result.data?.descentShareToken).toBeNull();
});

it('should return descent share token', async () => {
  const result = await testGetShareToken(
    { id: DESCENT_02 },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.descentShareToken).toEqual(DESCENT_2_SHARE_TOKEN);
});
