import { holdTransaction, rollbackTransaction } from '@db';
import { UserRawInput } from '@features/users';
import { TEST_USER } from '@seeds/01_users';
import { countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

let tBefore: number;

beforeAll(async () => {
  [tBefore] = await countRows(true, 'fcm_tokens');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation addFCMToken($token: String!) {
    addFCMToken(token: $token)
  }
`;

const addToken = (token: string, user?: UserRawInput) =>
  runQuery(mutation, { token }, fakeContext(user));

it('should fail for anons', async () => {
  const result = await addToken('foo');
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should add new token', async () => {
  await addToken('foo', TEST_USER);
  const [tAfter] = await countRows(false, 'fcm_tokens');
  expect(tAfter - tBefore).toBe(1);
});

it('should not duplicate token', async () => {
  const result = await addToken('__fcm__token__', TEST_USER);
  expect(result.errors).toBeUndefined();
  const [tAfter] = await countRows(false, 'fcm_tokens');
  expect(tAfter - tBefore).toBe(0);
});
