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
  mutation removeFCMToken($token: String!) {
    removeFCMToken(token: $token)
  }
`;

const removeToken = (token: string, user?: UserRawInput) =>
  runQuery(mutation, { token }, fakeContext(user));

it('should fail for anons', async () => {
  const result = await removeToken('foo');
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should remove existing token', async () => {
  await removeToken('__fcm__token__', TEST_USER);
  const [tAfter] = await countRows(false, 'fcm_tokens');
  expect(tAfter - tBefore).toBe(-1);
});

it('should not fail on non-existing token', async () => {
  const result = await removeToken('foo', TEST_USER);
  expect(result.errors).toBeUndefined();
});
