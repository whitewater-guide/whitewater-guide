import { holdTransaction, rollbackTransaction } from '~/db';
import { anonContext, runQuery } from '~/test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listTags {
  tags {
    id
    name
    category
  }
}
`;

it('should return tags', async () => {
  const result = await runQuery(query, undefined, anonContext());
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.tags).toBeDefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags[0]).toEqual({
    id: expect.any(String),
    name: expect.any(String),
    category: expect.any(String),
  });
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, {}, anonContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags).toContainEqual({
    id: 'waterfalls',
    category: 'kayaking',
    name: 'Водопады',
  });
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, {}, anonContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.tags.length).toBe(5);
  expect(result.data!.tags).toContainEqual({
    id: 'creeking',
    category: 'kayaking',
    name: 'Creeking',
  });
});
