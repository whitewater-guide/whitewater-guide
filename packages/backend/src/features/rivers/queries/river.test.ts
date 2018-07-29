import { holdTransaction, rollbackTransaction } from '@db';
import { EDITOR_NO_EC } from '@seeds/01_users';
import { RIVER_GAL_1, RIVER_SJOA } from '@seeds/07_rivers';
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
  const result = await runQuery(query, { id: RIVER_GAL_1 });
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
    { id: RIVER_SJOA },
    fakeContext(EDITOR_NO_EC, 'ru'),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.river.name).toBe('Шоа');
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(
    query,
    { id: RIVER_SJOA },
    fakeContext(EDITOR_NO_EC, 'pt'),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.river.name).toBe('Sjoa');
});

it('should get sections', async () => {
  const result = await runQuery(query, { id: RIVER_GAL_1 });
  expect(result.data!.river.sections).toMatchSnapshot();
});
