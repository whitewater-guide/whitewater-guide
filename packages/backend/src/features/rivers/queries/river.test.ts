import { holdTransaction, rollbackTransaction } from '../../../db';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query river($id: ID, $language: String){
    river(id: $id, language: $language) {
      id
      language
      name
      altNames
      region {
        id
        language
        name
      }
      sections {
        nodes {
          id
          language
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
    { id: 'd4396dac-d528-11e7-9296-cec278b6b50a', language: 'ru' },
  );
  expect(result.data!.river.name).toBe('Шоа');
});

it('should be able to get basic attributes without translation', async () => {
  const result = await runQuery(query, { id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a', language: 'pt' });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.river.name', 'Not translated');
});

it('should get sections', async () => {
  const result = await runQuery(query, { id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' });
  expect(result.data!.river.sections).toMatchSnapshot();
});
