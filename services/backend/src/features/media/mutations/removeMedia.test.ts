import db, { holdTransaction, rollbackTransaction } from '~/db';
import { SectionsEditLogRaw } from '~/features/sections';
import { fileExistsInBucket, MEDIA, resetTestMinio } from '~/minio';
import {
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_NO_EC,
  EDITOR_NO_EC_ID,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_NORWAY } from '~/seeds/test/04_regions';
import { RIVER_SJOA } from '~/seeds/test/07_rivers';
import { NORWAY_SJOA_AMOT } from '~/seeds/test/09_sections';
import { PHOTO_1 } from '~/seeds/test/11_media';
import {
  anonContext,
  countRows,
  fakeContext,
  runQuery,
  UUID_REGEX,
} from '~/test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

let mBefore: number;
let msBefore: number;
let trBefore: number;

beforeAll(async () => {
  [mBefore, msBefore, trBefore] = await countRows(
    true,
    'media',
    'sections_media',
    'media_translations',
  );
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
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(mutation, vars, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
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
    const [m, ms, tr] = await countRows(
      false,
      'media',
      'sections_media',
      'media_translations',
    );
    expect([mBefore - m, msBefore - ms, trBefore - tr]).toMatchObject([
      1,
      1,
      2,
    ]);
  });

  it('should delete file from storage', async () => {
    const exists = await fileExistsInBucket(MEDIA, PHOTO_1);
    expect(exists).toBe(false);
  });

  it('should log this event', async () => {
    const entry: SectionsEditLogRaw = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: NORWAY_SJOA_AMOT,
      section_name: 'Amot',
      river_id: RIVER_SJOA,
      river_name: 'Sjoa',
      region_id: REGION_NORWAY,
      region_name: 'Norway',
      editor_id: EDITOR_NO_EC_ID,
      action: 'media_delete',
      diff: null,
      created_at: expect.any(Date),
    });
  });
});
