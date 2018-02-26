import { holdTransaction, rollbackTransaction } from '../../../db';
import { anonContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listTags($language: String) {
  tags(language: $language) {
    id
    language
    name
    category
  }
}
`;

test('should return tags', async () => {
  const result = await runQuery(query, undefined, anonContext);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.tags).toBeDefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags[0]).toEqual({
    id: expect.any(String),
    language: 'en',
    name: expect.any(String),
    category: expect.any(String),
  });
});

test('should be able to specify language', async () => {
  const result = await runQuery(query, { language: 'ru' }, anonContext);
  expect(result.errors).toBeUndefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags).toContainEqual({
    id: 'waterfalls',
    category: 'kayaking',
    name: 'Водопады',
    language: 'ru',
  });
});

test('should return id as name when not translated', async () => {
  const result = await runQuery(query, { language: 'ru' }, anonContext);
  expect(result.errors).toBeUndefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags).toContainEqual({
    id: 'creeking',
    category: 'kayaking',
    name: 'creeking',
    language: 'ru',
  });
});
