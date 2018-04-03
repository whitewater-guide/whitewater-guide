import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { TagCategory, TagInput } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation upsertTag($tag: TagInput!){
    upsertTag(tag: $tag){
      id
      name
      category
    }
  }
`;

const tag: TagInput = {
  id: 'new_tag',
  name: 'New tag',
  category: TagCategory.misc,
};

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { tag }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertTag', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { tag }, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertTag', null);
  });

  test('admin should not pass', async () => {
    const result = await runQuery(upsertQuery, { tag }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertTag', null);
  });

  test('should throw on invalid input', async () => {
    const invalidInput = {
      id: 'a b',
      name: 'x',
      category: 'misc', // Bad category is validated by Graphql enum
    };
    const result = await runQuery(upsertQuery, { tag: invalidInput }, fakeContext(ADMIN));
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data!.upsertTag).toBeNull();
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });
});

describe('insert', () => {
  it('should return result', async () => {
    const result = await runQuery(upsertQuery, { tag }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.upsertTag).toEqual({ ...tag });
  });

  it('should add one more tag', async () => {
    const { count } = await db().table('tags').count().first();
    const initialTagsCount = Number(count);
    await runQuery(upsertQuery, { tag }, fakeContext(ADMIN));
    const { count: tagCount } = await db().table('tags').count().first();
    expect(Number(tagCount) - initialTagsCount).toBe(1);
  });

});

describe('update', () => {
  const input: TagInput = {
    id: 'waterfalls',
    name: 'Old waterfalls',
    category: TagCategory.kayaking,
  };

  let initialTagsCount: number;
  let updateResult: any;
  let updatedTag: any;

  beforeAll(async () => {
    const { count } = await db(true).table('tags').count().first();
    initialTagsCount = Number(count);
  });

  beforeEach(async () => {
    updateResult = await runQuery(upsertQuery, { tag: input }, fakeContext(ADMIN));
    updatedTag = updateResult && updateResult.data && updateResult.data.upsertTag;
  });

  afterEach(() => {
    updateResult = null;
    updatedTag = null;
  });

  it('should return result', async () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updatedTag).toBeDefined();
    expect(updatedTag.id).toBe(input.id);
  });

  it('should not change total number of tags', async () => {
    const { count } = await db().table('tags').count().first();
    expect(initialTagsCount - Number(count)).toBe(0);
  });

});

describe('i18n', () => {
  const inputFr: TagInput = {
    id: 'waterfalls',
    name: 'Le waterfalls',
    category: TagCategory.misc,
  };

  it('should add new translation', async () => {
    const { count: oldCount } = await db().table('tags_translations').count().first();
    await runQuery(upsertQuery, { tag: inputFr }, fakeContext(ADMIN, 'fr'));
    const { count: newCount } = await db().table('tags_translations').count().first();
    expect(Number(newCount) - Number(oldCount)).toBe(1);
    const { name } = await db().table('tags_view').select('name')
      .where({ language: 'fr', id: inputFr.id }).first();
    expect(name).toBe('Le waterfalls');
  });

  it('should modify common props in other language', async () => {
    await runQuery(upsertQuery, { tag: inputFr }, fakeContext(ADMIN, 'fr'));
    const { category } = await db().table('tags_view').select('category')
      .where({ language: 'en', id: inputFr.id }).first();
    expect(category).toBe(TagCategory.misc);
  });

  it('should modify existing translation', async () => {
    const { count: oldCount } = await db().table('tags_translations').count().first();
    await runQuery(upsertQuery, { tag: inputFr }, fakeContext(ADMIN, 'en'));
    const { count: newCount } = await db().table('tags_translations').count().first();
    expect(newCount).toBe(oldCount);
    const { name } = await db().table('tags_view').select('name')
      .where({ language: 'en', id: inputFr.id }).first();
    expect(name).toBe('Le waterfalls');
  });
});

it('should sanitize input', async () => {
  const dirty = { ...tag, name: "it's a \\ slash" };
  const result = await runQuery(upsertQuery, { tag: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty('data.upsertTag.name', "it's a \\ slash");
});
