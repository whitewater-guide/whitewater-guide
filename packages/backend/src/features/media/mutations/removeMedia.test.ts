import { holdTransaction, rollbackTransaction } from '../../../db';
import { fileExistsInBucket, MEDIA, resetTestMinio } from '../../../minio';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '../../../seeds/test/01_users';
import { PHOTO_1 } from '../../../seeds/test/11_media';
import { anonContext, fakeContext } from '../../../test/context';
import { countRows, runQuery } from '../../../test/db-helpers';

let mBefore: number;
let msBefore: number;
let trBefore: number;

beforeAll(async () => {
  [mBefore, msBefore, trBefore] = await countRows(true, 'media', 'sections_media', 'media_translations');
});

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

const mutation = `
  mutation removeMedia($id: ID!){
    removeMedia(id: $id) {
      id
      deleted
    }
  }
`;

const vars = { id: PHOTO_1 };

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, vars, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeMedia', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeMedia', null);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeMedia', null);
  });

  it('admin should pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.removeMedia).toBeDefined();
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(mutation, vars, fakeContext(EDITOR_NO_EC));
  });

  afterEach(() => {
    result = null;
  });

  it('should return partial media as deleted', () => {
    expect(result.data.removeMedia).toEqual({
      id: PHOTO_1,
      deleted: true,
    });
  });

  it('should remove from tables', async () => {
    const [m, ms, tr] = await countRows(false, 'media', 'sections_media', 'media_translations');
    expect([mBefore - m, msBefore - ms, trBefore - tr]).toMatchObject([1, 1, 2]);
  });

  it('should delete file from storage', async () => {
    const exists = await fileExistsInBucket(MEDIA, PHOTO_1);
    expect(exists).toBe(false);
  });
});
