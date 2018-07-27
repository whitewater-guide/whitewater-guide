import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { anonContext, countRows, fakeContext, runQuery } from '@test';

const query = `
  mutation removeTag($id: String!){
    removeTag(id: $id)
  }
`;

const variables = { id: 'waterfalls' };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {

  it('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeTag', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeTag', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeTag', null);
  });
});

describe('effects', () => {
  let result: any;
  let tagsBefore: number;
  let translationsBefore: number;

  beforeAll(async () => {
    [tagsBefore, translationsBefore] = await countRows(true, 'tags', 'tags_translations');
  });

  beforeEach(async () => {
    result = await runQuery(query, variables, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted tag id', () => {
    expect(result.data.removeTag).toBe(variables.id);
  });

  it('should remove from tags table', async () => {
    const [tagsAfter] = await countRows(false, 'tags');
    expect(tagsBefore - tagsAfter).toBe(1);
  });

  it('should remove from translations table', async () => {
    const [translationsAfter] = await countRows(false, 'tags_translations');
    expect(translationsBefore - translationsAfter).toBe(2);
  });

});
