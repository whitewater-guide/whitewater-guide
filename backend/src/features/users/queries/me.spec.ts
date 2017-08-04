import { holdTransaction, rollbackTransaction } from '../../../db/db';
import { anonContext, superAdminContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { User } from '../types';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
{
  me {
    id
    name
    avatar
    role
    email
    createdAt
    updatedAt
  }
}
`;

test('should return null for anon', async () => {
  const result = await runQuery(query, undefined, anonContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.me).toBeNull();
});

test('should user', async () => {
  const result = await runQuery(query, undefined, superAdminContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  const me: User = result.data!.me;
  expect(noTimestamps(me)).toEqual(noTimestamps(superAdminContext.user));
  expect(me.createdAt).toBe(superAdminContext.user!.created_at.toISOString());
  expect(me.updatedAt).toBe(superAdminContext.user!.updated_at.toISOString());
});
