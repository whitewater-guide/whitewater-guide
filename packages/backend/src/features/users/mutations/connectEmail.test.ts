import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { MailType, sendMail } from '~/mail';
import {
  EDITOR_GE,
  EDITOR_NO,
  EDITOR_NO_EC,
  TEST_USER2,
} from '~/seeds/test/01_users';

import { testConnectEmail } from './connectEmail.test.generated';

jest.mock('~/mail');

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

const TOKEN = '__connect_email_token__';
const EMAIL = 'test2@user.com';
const PASSWORD = 'p@__w01rd';

const _mutation = gql`
  mutation connectEmail($email: String!, $password: String!, $token: String!) {
    connectEmail(email: $email, password: $password, token: $token)
  }
`;

it('should fail if user is not authorized', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail if user already has password', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    fakeContext(EDITOR_NO),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should fail if password is weak', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: 'xxx', token: TOKEN },
    fakeContext(TEST_USER2),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('should fail if email is incorrect', async () => {
  const result = await testConnectEmail(
    { email: 'foo', password: PASSWORD, token: TOKEN },
    fakeContext(TEST_USER2),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('should fail if email does not match email for token', async () => {
  const result = await testConnectEmail(
    { email: 'foo@bar.com', password: PASSWORD, token: TOKEN },
    fakeContext(TEST_USER2),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.BAD_USER_INPUT);
});

it('should fail if user has no token', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    fakeContext(EDITOR_GE),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should fail if token expired', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    fakeContext(EDITOR_NO_EC),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.BAD_USER_INPUT);
});

it('should fail if token does not match', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: 'fooo' },
    fakeContext(TEST_USER2),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.BAD_USER_INPUT);
});

it('should set email and password, delete token', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    fakeContext(TEST_USER2),
  );
  expect(result.data?.connectEmail).toBe(true);
  const user = await db(false)
    .select('*')
    .from('users')
    .where({ id: TEST_USER2.id })
    .first();
  expect(user.tokens).toEqual([]);
  expect(user.email).toBe(EMAIL);
  expect(user.password).toBeTruthy();
});

it('should send email', async () => {
  const result = await testConnectEmail(
    { email: EMAIL, password: PASSWORD, token: TOKEN },
    fakeContext(TEST_USER2),
  );
  expect(result.data?.connectEmail).toBe(true);
  expect(sendMail).toHaveBeenCalledWith(MailType.CONNECT_EMAIL_SUCCESS, EMAIL, {
    user: {
      id: TEST_USER2.id,
      name: TEST_USER2.name,
    },
  });
});
