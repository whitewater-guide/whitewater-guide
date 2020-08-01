import { holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER2, TEST_USER } from '~/seeds/test/01_users';
import { runQuery, fakeContext } from '~/test';
import { DESCENT_02, DESCENT_2_SHARE_TOKEN } from '~/seeds/test/18_descents';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query getShareToken($id: ID!) {
    descentShareToken(id: $id)
  }
`;

type PermissionsTestCase = [string, any, boolean];

it.each<PermissionsTestCase>([
  ['anon', undefined, false],
  ['non-owner', TEST_USER2, false],
])('%s should not get share token', async (_, user, allowed) => {
  const result = await runQuery(query, { id: DESCENT_02 }, fakeContext(user));
  if (allowed) {
    expect(result.errors).toBeUndefined();
    expect(result.data?.descentShareToken).toBeTruthy();
  } else {
    expect(result.errors).toBeTruthy();
    expect(result.data?.descentShareToken).toBeNull();
  }
});

it('should return descent share token', async () => {
  const result = await runQuery(
    query,
    { id: DESCENT_02 },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.descentShareToken).toEqual(DESCENT_2_SHARE_TOKEN);
});
