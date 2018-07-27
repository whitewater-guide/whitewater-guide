import { holdTransaction, rollbackTransaction } from '@db';
import { EDITOR_NO_EC } from '@seeds/01_users';
import { fakeContext, noTimestamps, runQuery } from '@test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query river($id: ID){
    river(id: $id) {
      id
      name
      altNames
      region {
        id
        name
      }
      sections {
        nodes {
          id
          name
        }
        count
      }
      createdAt
      updatedAt
    }
  }
`;

it('should return river', async () => {
  const result = await runQuery(query, { id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' });
  expect(result.errors).toBeUndefined();
  const river = result.data!.river;
  expect(noTimestamps(river)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.river).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(
    query,
    { id: 'd4396dac-d528-11e7-9296-cec278b6b50a' },
    fakeContext(EDITOR_NO_EC, 'ru'),
  );
  expect(result.data!.river.name).toBe('Шоа');
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(
    query,
    { id: 'd4396dac-d528-11e7-9296-cec278b6b50a' },
    fakeContext(EDITOR_NO_EC, 'pt'),
  );
  expect(result.data!.river.name).toBe('Sjoa');
});

it('should get sections', async () => {
  const result = await runQuery(query, { id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' });
  expect(result.data!.river.sections).toMatchSnapshot();
});
