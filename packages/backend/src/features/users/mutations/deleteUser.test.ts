import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  EDITOR_GA_EC,
  TEST_USER,
  TEST_USER_ID,
} from '~/seeds/test/01_users';

import { testDeleteUser } from './deleteUser.test.generated';

jest.mock('../../chats/SynapseClient');

const _mutation = gql`
  mutation deleteUser($id: String, $email: String) {
    deleteUser(id: $id, email: $email)
  }
`;

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testDeleteUser({ id: TEST_USER_ID }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('editor should not pass', async () => {
    const result = await testDeleteUser(
      { id: TEST_USER_ID },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

it('should delete by id', async () => {
  const result = await testDeleteUser({ id: TEST_USER_ID }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  const [{ count }] = await db()
    .table('users')
    .count()
    .where('id', TEST_USER_ID);
  expect(count).toBe('0');
});

it('should delete by email', async () => {
  const result = await testDeleteUser(
    { email: TEST_USER.email },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  const [{ count }] = await db()
    .table('users')
    .count()
    .where('id', TEST_USER_ID);
  expect(count).toBe('0');
});
