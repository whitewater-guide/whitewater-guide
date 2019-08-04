import { holdTransaction, rollbackTransaction } from '@db';
import {
  ADMIN,
  ADMIN_ID,
  UNVERIFIED_USER2,
  UNVERIFIED_USER2_ID,
} from '@seeds/01_users';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes, UserInput } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation updateProfile($user: UserInput!) {
    updateProfile(user: $user) {
      id
      name
      avatar
      language
      imperial
      email
    }
  }
`;

it('should fail for anons', async () => {
  const user = { name: 'Vasya' };
  const result = await runQuery(mutation, { user }, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail for invalid input', async () => {
  const user: UserInput = {
    name: 'I',
    language: 'bg',
  };
  const result = await runQuery(mutation, { user }, fakeContext(ADMIN));
  expect(result).toHaveGraphqlValidationError();
});

it('should work for partial data', async () => {
  const result = await runQuery(
    mutation,
    { user: { name: 'Vasya' } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.updateProfile).toEqual({
    id: ADMIN_ID,
    name: 'Vasya',
    // tslint:disable-next-line:max-line-length
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
  const result = await runQuery(mutation, { user }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.updateProfile).toEqual({
    id: ADMIN_ID,
    email: ADMIN.email,
    ...user,
  });
});

it('should not update email when user already has one', async () => {
  const user: UserInput = {
    email: 'foo@bar.com',
  };
  const result = await runQuery(mutation, { user }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.updateProfile).toMatchObject({
    id: ADMIN_ID,
    email: ADMIN.email,
  });
});

it('should update email when it is null', async () => {
  const user: UserInput = {
    email: 'foo@bar.com',
  };
  const result = await runQuery(
    mutation,
    { user },
    fakeContext(UNVERIFIED_USER2),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.updateProfile).toMatchObject({
    id: UNVERIFIED_USER2_ID,
    email: 'foo@bar.com',
  });
});
