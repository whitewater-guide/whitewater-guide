import { countRows, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { TEST_USER, TEST_USER2 } from '~/seeds/test/01_users';
import { DESCENT_01, DESCENT_04 } from '~/seeds/test/18_descents';

import { testDeleteDescent } from './deleteDescent.test.generated';

let dBefore: number;

beforeAll(async () => {
  [dBefore] = await countRows(true, 'descents');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation deleteDescent($id: ID!) {
    deleteDescent(id: $id)
  }
`;

type PermissionsTestCase = [string, any, ApolloErrorCodes | undefined];

it.each<PermissionsTestCase>([
  ['anon', undefined, ApolloErrorCodes.UNAUTHENTICATED],
  ['non-owner', TEST_USER2, ApolloErrorCodes.FORBIDDEN],
])('%s should not delete descent', async (_, user, error) => {
  const result = await testDeleteDescent({ id: DESCENT_01 }, fakeContext(user));
  expect(result).toHaveGraphqlError(error);
  expect(result.data?.deleteDescent).toBeNull();
});

it('owner should delete descent', async () => {
  const result = await testDeleteDescent(
    { id: DESCENT_01 },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.deleteDescent).toBe(true);
});

it('should delete descent and nullify parent references', async () => {
  await testDeleteDescent({ id: DESCENT_01 }, fakeContext(TEST_USER));
  const [dAfter] = await countRows(false, 'descents');
  expect(dBefore - dAfter).toBe(1);
  const d4 = await db(false)
    .select()
    .from('descents')
    .where({ id: DESCENT_04 })
    .first();
  expect(d4.parent_id).toBeNull();
});
