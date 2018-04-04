import { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
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
    admin
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

it('should return null for anon', async () => {
  const result = await runQuery(query, undefined, anonContext());
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toBeNull();
});

it('should user', async () => {
  const result = await runQuery(query, undefined, fakeContext(EDITOR_GA_EC));
  expect(result.errors).toBeUndefined();
  expect(result.data!.me).toMatchSnapshot();
});
