import { MediaKind } from '@whitewater-guide/commons';
import Knex from 'knex';
import { MediaRaw } from '~/features/media';
import { ADMIN_ID } from './01_users';
import { GALICIA_BECA_LOWER, NORWAY_SJOA_AMOT } from './09_sections';

export const BLOG_1 = 'a326622c-1ee5-11e8-b467-0ed5f89f718b';
export const PHOTO_1 = 'a32664ca-1ee5-11e8-b467-0ed5f89f718b';
export const PHOTO_2 = 'd0d234de-1ee6-11e8-b467-0ed5f89f718b';
export const VIDEO_1 = 'a3266920-1ee5-11e8-b467-0ed5f89f718b';
export const VIDEO_2 = '0cfaf4dc-1ef1-11e8-b467-0ed5f89f718b';

const media: Array<Partial<MediaRaw>> = [
  {
    id: BLOG_1,
    kind: MediaKind.blog,
    url: 'http://some.blog',
    default_lang: 'en',
  },
  {
    id: PHOTO_1,
    kind: MediaKind.photo,
    url: PHOTO_1, // Exists in seed minio data
    resolution: [800, 600],
    weight: 1,
    created_by: ADMIN_ID,
    size: 100000,
    default_lang: 'en',
  },
  {
    id: PHOTO_2,
    kind: MediaKind.photo,
    url: PHOTO_2, // Exists in seed minio data
    resolution: [1024, 768],
    size: 333333,
    default_lang: 'en',
  },
  {
    id: VIDEO_1,
    kind: MediaKind.video,
    url: 'http://some.video',
    resolution: [1920, 1080],
    default_lang: 'en',
  },
  {
    id: VIDEO_2,
    kind: MediaKind.video,
    url: 'http://some2.video',
    resolution: [1920, 1080],
    default_lang: 'en',
  },
];

const mediaEn = [
  {
    language: 'en',
    media_id: BLOG_1,
    description: 'Blog description',
    copyright: 'Blog copyright',
  },
  {
    language: 'en',
    media_id: PHOTO_1,
    description: 'Photo 1 description',
    copyright: 'Photo 1 copyright',
  },
  {
    language: 'en',
    media_id: PHOTO_2,
    description: 'Photo 2 description',
    copyright: 'Photo 2 copyright',
  },
  {
    language: 'en',
    media_id: VIDEO_1,
    description: 'Video description',
    copyright: 'Video copyright',
  },
  {
    language: 'en',
    media_id: VIDEO_2,
    description: 'Video 2 description',
    copyright: 'Video 2 copyright',
  },
];

const mediaRu = [
  {
    language: 'ru',
    media_id: PHOTO_1,
    description: 'Фото 1 описание',
    copyright: 'Фото 2 описание',
  },
];

const sectionsMedia = [
  { section_id: NORWAY_SJOA_AMOT, media_id: BLOG_1 },
  { section_id: NORWAY_SJOA_AMOT, media_id: PHOTO_1 },
  { section_id: NORWAY_SJOA_AMOT, media_id: PHOTO_2 },
  { section_id: NORWAY_SJOA_AMOT, media_id: VIDEO_1 },
  { section_id: GALICIA_BECA_LOWER, media_id: VIDEO_2 },
];

export async function seed(db: Knex) {
  await db.table('media').del();
  await db.table('media_translations').del();
  await db.table('sections_media').del();

  await db.table('media').insert(media);
  await db.table('media_translations').insert([...mediaRu, ...mediaEn]);
  await db.table('sections_media').insert(sectionsMedia);
}
