import { holdTransaction, rollbackTransaction } from '../../../db';
import { fileExistsInBucket, MEDIA, resetTestMinio } from '../../../minio';
import { PHOTO_1 } from '../../../seeds/test/10_media';
import { adminContext, anonContext, userContext } from '../../../test/context';
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
      language
      deleted
    }
  }
`;

const vars = { id: PHOTO_1 };

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, vars, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.removeMedia', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, vars, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.removeMedia', null);
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(mutation, vars, adminContext);
  });

  afterEach(() => {
    result = null;
  });

  it('should return partial media as deleted', () => {
    expect(result.data.removeMedia).toEqual({
      id: PHOTO_1,
      language: 'en',
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
