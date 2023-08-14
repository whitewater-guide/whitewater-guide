import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { MailType, sendMail } from '~/mail';
import {
  ADMIN,
  EDITOR_GE,
  EDITOR_NO,
  TEST_USER,
  TEST_USER2,
  UNVERIFIED_USER,
} from '~/seeds/test/01_users';

import { testRequestConnectEmail } from './requestConnectEmail.test.generated';

jest.mock('~/mail');

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation requestConnectEmail($email: String!) {
    requestConnectEmail(email: $email)
  }
`;

it('should fail if user is not authorized', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail if email is invalid', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo' },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('should fail if email is taken by other user', async () => {
  const result = await testRequestConnectEmail(
    { email: 'kaospostage@gmail.com' },
    fakeContext(TEST_USER2),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('should fail if user is not verified', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(UNVERIFIED_USER),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should fail if user is logged in via email', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(TEST_USER),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should fail if user has email+password', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(EDITOR_NO),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
});

it('should save token', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(EDITOR_GE),
  );
  expect(result.data?.requestConnectEmail).toBe(true);
  const user = await db(false)
    .select('*')
    .from('users')
    .where({ id: EDITOR_GE.id })
    .first();
  expect(user.tokens).toEqual([
    {
      claim: 'connectEmail',
      expires: expect.any(Number),
      value: expect.any(String),
    },
  ]);
});

it('should overwrite existing token', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(TEST_USER2),
  );
  expect(result.data?.requestConnectEmail).toBe(true);
  const user = await db(false)
    .select('*')
    .from('users')
    .where({ id: TEST_USER2.id })
    .first();
  expect(user.tokens).toEqual([
    {
      claim: 'connectEmail',
      expires: expect.any(Number),
      value: expect.any(String),
    },
  ]);
  expect(user.tokens[0].expires).not.toEqual(2145906000000);
});

it('should send email', async () => {
  const result = await testRequestConnectEmail(
    { email: 'foo@mail.com' },
    fakeContext(EDITOR_GE),
  );
  expect(result.data?.requestConnectEmail).toBe(true);
  expect(sendMail).toHaveBeenCalledWith(
    MailType.CONNECT_EMAIL_REQUEST,
    'foo@mail.com',
    {
      email: 'foo%40mail.com',
      user: {
        id: EDITOR_GE.id,
        name: EDITOR_GE.name,
      },
      token: {
        expires: expect.any(Number),
        raw: expect.any(String),
        encrypted: expect.any(String),
      },
    },
  );
});
