import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { TagInput } from '@whitewater-guide/schema';
import { TagCategory } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/index';
import type {
  UpsertTagMutation,
  UpsertTagMutationResult,
} from './upsertTag.test.generated';
import { testUpsertTag } from './upsertTag.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation upsertTag($tag: TagInput!) {
    upsertTag(tag: $tag) {
      id
      name
      category
    }
  }
`;

const tag: TagInput = {
  id: 'new_tag',
  name: 'New tag',
  category: TagCategory.Misc,
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testUpsertTag({ tag }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testUpsertTag({ tag }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testUpsertTag({ tag }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput = {
      id: 'a b',
      name: 'x',
      category: 'misc', // Bad category is validated by Graphql enum
    };
    const result = await testUpsertTag(
      // @ts-expect-error: invalid input
      { tag: invalidInput },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  it('should return result', async () => {
    const result = await testUpsertTag({ tag }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.upsertTag).toEqual({ ...tag });
  });

  it('should add one more tag', async () => {
    const { count } = await db().table('tags').count().first();
    const initialTagsCount = Number(count);
    await testUpsertTag({ tag }, fakeContext(ADMIN));
    const { count: tagCount } = await db().table('tags').count().first();
    expect(Number(tagCount) - initialTagsCount).toBe(1);
  });
});

describe('update', () => {
  const input: TagInput = {
    id: 'waterfalls',
    name: 'Old waterfalls',
    category: TagCategory.Kayaking,
  };

  let initialTagsCount: number;
  let updateResult: UpsertTagMutationResult | null = null;
  let updatedTag: UpsertTagMutation['upsertTag'] | null = null;

  beforeAll(async () => {
    const { count } = await db(true).table('tags').count().first();
    initialTagsCount = Number(count);
  });

  beforeEach(async () => {
    updateResult = await testUpsertTag({ tag: input }, fakeContext(ADMIN));
    updatedTag = updateResult?.data?.upsertTag;
  });

  afterEach(() => {
    updateResult = null;
    updatedTag = null;
  });

  it('should return result', () => {
    expect(updateResult?.errors).toBeUndefined();
    expect(updateResult?.data).toBeDefined();
    expect(updatedTag).toBeDefined();
    expect(updatedTag?.id).toBe(input.id);
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
    category: TagCategory.Misc,
  };

  it('should add new translation', async () => {
    const { count: oldCount } = await db()
      .table('tags_translations')
      .count()
      .first();
    await testUpsertTag({ tag: inputFr }, fakeContext(ADMIN, 'fr'));
    const { count: newCount } = await db()
      .table('tags_translations')
      .count()
      .first();
    expect(Number(newCount) - Number(oldCount)).toBe(1);
    const { name } = await db()
      .table('tags_view')
      .select('name')
      .where({ language: 'fr', id: inputFr.id })
      .first();
    expect(name).toBe('Le waterfalls');
  });

  it('should modify common props in other language', async () => {
    await testUpsertTag({ tag: inputFr }, fakeContext(ADMIN, 'fr'));
    const { category } = await db()
      .table('tags_view')
      .select('category')
      .where({ language: 'en', id: inputFr.id })
      .first();
    expect(category).toBe(TagCategory.Misc);
  });

  it('should modify existing translation', async () => {
    const { count: oldCount } = await db()
      .table('tags_translations')
      .count()
      .first();
    await testUpsertTag({ tag: inputFr }, fakeContext(ADMIN, 'en'));
    const { count: newCount } = await db()
      .table('tags_translations')
      .count()
      .first();
    expect(newCount).toBe(oldCount);
    const { name } = await db()
      .table('tags_view')
      .select('name')
      .where({ language: 'en', id: inputFr.id })
      .first();
    expect(name).toBe('Le waterfalls');
  });
});

it('should sanitize input', async () => {
  const dirty = { ...tag, name: "it's a \\ $1 slash with . ?" };
  const result = await testUpsertTag({ tag: dirty }, fakeContext(ADMIN));
  expect(result).toHaveProperty(
    'data.upsertTag.name',
    "it's a \\ $1 slash with . ?",
  );
});
