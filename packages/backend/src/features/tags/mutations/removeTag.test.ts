import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation removeTag($id: String!){
    removeTag(id: $id)
  }
`;

const variables = { id: 'waterfalls' };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeTag).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeTag).toBeNull();
  });

  test('admin should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.removeTag).toBeNull();
  });
});

describe('effects', () => {
  let result: any;
  let initialTagsCount: number;
  let initialTranslationsCount: number;

  beforeAll(async () => {
    const tagsCount = await db(true).table('tags').count().first();
    const translationsCount = await db(true).table('tags_translations').count().first();
    initialTagsCount = Number(tagsCount.count);
    initialTranslationsCount = Number(translationsCount.count);
  });

  beforeEach(async () => {
    result = await runQuery(query, variables, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  test('should return deleted tag id', () => {
    expect(result.data.removeTag).toBe(variables.id);
  });

  test('should remove from tags table', async () => {
    const { count } = await db().table('tags').count().first();
    expect(initialTagsCount - Number(count)).toBe(1);
  });

  test('should remove from translations table', async () => {
    const { count } = await db().table('tags_translations').count().first();
    expect(initialTranslationsCount - Number(count)).toBe(2);
  });

});
