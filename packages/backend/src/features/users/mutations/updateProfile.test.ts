import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, ADMIN_ID } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';
import { UserInput } from '../../../ww-commons';

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
    }
  }
`;

it('should fail for anons', async () => {
  const user = { name: 'Vasya' };
  const result = await runQuery(mutation, { user }, anonContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toHaveProperty('updateProfile', null);
});

it('should fail for invalid input', async () => {
  const user: UserInput = {
    name: 'I',
    language: 'bg',
  };
  const result = await runQuery(mutation, { user }, fakeContext(ADMIN));
  expect(result).toHaveProperty('errors.0.name', 'ValidationError');
});

it('should work for partial data', async () => {
  const result = await runQuery(mutation, { user: { name: 'Vasya' } }, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.updateProfile).toEqual({
    id: ADMIN_ID,
    name: 'Vasya',
    avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c34.34.422.422/s50x50/557311_106591882827406_2013499307_n.jpg?oh=777cb7f306789d5452fb47bc87ba95c7&oe=59FD2267',
    language: 'en',
    imperial: false,
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
    ...user,
  });
});
