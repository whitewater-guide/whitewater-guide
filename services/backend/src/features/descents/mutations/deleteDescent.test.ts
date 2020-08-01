import db, { holdTransaction, rollbackTransaction } from '~/db';
import { fakeContext, runQuery, countRows } from '~/test';
import { DESCENT_01, DESCENT_04 } from '~/seeds/test/18_descents';
import { TEST_USER2, TEST_USER } from '~/seeds/test/01_users';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

let dBefore: number;

beforeAll(async () => {
  [dBefore] = await countRows(true, 'descents');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation deleteDescent($id: ID!) {
    deleteDescent(id: $id)
  }
`;

type PermissionsTestCase = [string, any, ApolloErrorCodes | undefined];

it.each<PermissionsTestCase>([
  [
    'anon should not delete descent',
    undefined,
    ApolloErrorCodes.UNAUTHENTICATED,
  ],
  [
    'non-owner should not delete descent',
    TEST_USER2,
    ApolloErrorCodes.FORBIDDEN,
  ],
  ['owner should delete descent', TEST_USER, undefined],
])('%s', async (_, user, error) => {
  const result = await runQuery(
    mutation,
    { id: DESCENT_01 },
    fakeContext(user),
  );
  if (error) {
    expect(result).toHaveGraphqlError(error);
    expect(result.data?.deleteDescent).toBeNull();
  } else {
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteDescent).toBe(true);
  }
});

it('should delete descent and nullify parent references', async () => {
  await runQuery(mutation, { id: DESCENT_01 }, fakeContext(TEST_USER));
  const [dAfter] = await countRows(false, 'descents');
  expect(dBefore - dAfter).toBe(1);
  const d4 = await db(false)
    .select()
    .from('descents')
    .where({ id: DESCENT_04 })
    .first();
  expect(d4.parent_id).toBeNull();
});
