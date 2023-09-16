import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { UserInput } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  ADMIN_ID,
  UNVERIFIED_USER2,
  UNVERIFIED_USER2_ID,
} from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/index';
import { testUpdateProfile } from './updateProfile.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation updateProfile($user: UserInput!) {
    updateProfile(user: $user) {
      ...UserCore
      language
      imperial
    }
  }
`;

it('should fail for anons', async () => {
  const user = { name: 'Vasya' };
  const result = await testUpdateProfile({ user }, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail for invalid input', async () => {
  const user: UserInput = {
    name: 'I',
    language: 'bg',
  };
  const result = await testUpdateProfile({ user }, fakeContext(ADMIN));
  expect(result).toHaveGraphqlValidationError();
});

it('should work for partial data', async () => {
  const result = await testUpdateProfile(
    { user: { name: 'Vasya' } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateProfile).toEqual({
    id: ADMIN_ID,
    name: 'Vasya',
    avatar: null,
    language: 'en',
    imperial: false,
    email: ADMIN.email,
  });
});

it('should return update profile', async () => {
  const user: UserInput = {
    name: 'Vasya',
    avatar: null,
    language: 'ru',
    imperial: true,
  };
  const result = await testUpdateProfile({ user }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateProfile).toEqual({
    id: ADMIN_ID,
    email: ADMIN.email,
    ...user,
  });
});

it('should not update email when user already has one', async () => {
  const user: UserInput = {
    email: 'foo@bar.com',
  };
  const result = await testUpdateProfile({ user }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateProfile).toMatchObject({
    id: ADMIN_ID,
    email: ADMIN.email,
  });
});

it('should update email when it is null', async () => {
  const user: UserInput = {
    email: 'foo@bar.com',
  };
  const result = await testUpdateProfile(
    { user },
    fakeContext(UNVERIFIED_USER2),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.updateProfile).toMatchObject({
    id: UNVERIFIED_USER2_ID,
    email: 'foo@bar.com',
  });
});
