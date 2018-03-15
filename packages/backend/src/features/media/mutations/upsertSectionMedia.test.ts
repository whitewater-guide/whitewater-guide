import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { GALICIA_R1_S1, NORWAY_SJOA_AMOT } from '../../../seeds/test/08_sections';
import { PHOTO_1, PHOTO_2 } from '../../../seeds/test/10_media';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { countTables, noUnstable, runQuery } from '../../../test/db-helpers';
import { MediaInput, MediaKind } from '../../../ww-commons/features/media';

let mBefore: number;
let msBefore: number;
let trBefore: number;

beforeAll(async () => {
  [mBefore, msBefore, trBefore] = await countTables(true, 'media', 'sections_media', 'media_translations');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation upsertSectionMedia($sectionId: ID!, $media: MediaInput!, $language: String){
    upsertSectionMedia(sectionId: $sectionId, media: $media, language: $language){
      id
      language
      kind
      description
      copyright
      url
      resolution
      weight
      createdAt
      updatedAt
    }
  }
`;

const sectionId = NORWAY_SJOA_AMOT;

const media: MediaInput = {
  id: null,
  copyright: 'new media copyright',
  description: 'new media description',
  kind: MediaKind.photo,
  url: 'photo.jpg',
  resolution: [1920, 1080],
  weight: null,
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, { sectionId, media }, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertSectionMedia', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, { sectionId, media }, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertSectionMedia', null);
  });

  it('should throw on invalid input', async () => {
    const badMedia = {
      id: 'wtf',
      copyright: 'new media copyright',
      description: 'new media description',
      kind: MediaKind.photo,
      url: 'zzzzz',
      resolution: [800, 600, 900],
      weight: -10,
    };
    const result = await runQuery(mutation, { sectionId, media: badMedia }, adminContext);
    expect(result).toHaveProperty('data.upsertSectionMedia', null);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });

});

describe('insert', () => {
  it('should fail on non-existing section id', async () => {
    const result = await runQuery(mutation, { sectionId: '852421bc-2848-11e8-b467-0ed5f89f718b', media }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result).toHaveProperty('errors.0.message', 'Invalid section id');
    expect(result).toHaveProperty('data.upsertSectionMedia', null);
  });

  it('should return result', async () => {
    const result = await runQuery(mutation, { sectionId, media }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(noUnstable(result.data)).toMatchSnapshot();
  });

  it('should add one more media to db', async () => {
    await runQuery(mutation, { sectionId, media }, adminContext);
    const [m, ms, tr] = await countTables(false, 'media', 'sections_media', 'media_translations');
    expect([m - mBefore, ms - msBefore, tr - trBefore]).toMatchObject([1, 1, 1]);
  });
});

describe('update', () => {
  const uMedia = { ...media, id: PHOTO_1 };

  it('should fail on wrong section id', async () => {
    const result = await runQuery(mutation, { sectionId: GALICIA_R1_S1, media: uMedia }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result).toHaveProperty('errors.0.message', 'Invalid section id');
    expect(result).toHaveProperty('data.upsertSectionMedia', null);
  });

  it('should return result', async () => {
    const result = await runQuery(mutation, { sectionId, media: uMedia }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(noUnstable(result.data)).toMatchSnapshot();
  });

  it('should not change db counts', async () => {
    await runQuery(mutation, { sectionId, media: uMedia }, adminContext);
    const [m, ms, tr] = await countTables(false, 'media', 'sections_media', 'media_translations');
    expect([m - mBefore, ms - msBefore, tr - trBefore]).toMatchObject([0, 0, 0]);
  });

  it('should not change media kind', async () => {
    const badMedia = { ...uMedia, kind: 'blog' };
    const result = await runQuery(mutation, { sectionId, media: badMedia }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.upsertSectionMedia.kind', 'photo');
  });
});

describe('i18n', () => {
  const aMedia = { ...media, id: PHOTO_2 };
  const uMedia = { ...media, id: PHOTO_1 };

  it('should add new translation', async () => {
    await runQuery(mutation, { sectionId, media: aMedia, language: 'ru' }, adminContext);
    const [m, ms, tr] = await countTables(false, 'media', 'sections_media', 'media_translations');
    expect([m - mBefore, ms - msBefore, tr - trBefore]).toMatchObject([0, 0, 1]);
  });

  it('should modify common props in other language', async () => {
    await runQuery(mutation, { sectionId, media: aMedia, language: 'ru' }, adminContext);
    const { resolution } = await db().table('media_view').select('resolution')
      .where({ id: PHOTO_2, language: 'en' }).first();
    expect(resolution).toMatchObject([1920, 1080]);
  });

  it('should modify existing translation', async () => {
    await runQuery(mutation, { sectionId, media: uMedia, language: 'ru' }, adminContext);
    const [m, ms, tr] = await countTables(false, 'media', 'sections_media', 'media_translations');
    expect([m - mBefore, ms - msBefore, tr - trBefore]).toMatchObject([0, 0, 0]);
    const { description } = await db().table('media_view').select('description')
      .where({ id: PHOTO_1, language: 'ru' }).first();
    expect(description).toBe('new media description');
  });
});
