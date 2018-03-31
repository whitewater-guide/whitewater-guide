import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { User } from '../../../ww-commons';

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
    language
    imperial
    editorSettings {
      language
    }
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
  const result = await runQuery(query, undefined, adminContext);
  expect(result.errors).toBeUndefined();
  const me: User = result.data!.me;
  expect(me).toMatchSnapshot();
});
