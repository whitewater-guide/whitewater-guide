import { MediaRaw } from '../../features/media';
import { MediaKind } from '../../ww-commons';
import { NORWAY_SJOA_AMOT } from './08_sections';
import Knex = require('knex');

export const BLOG_1 = 'a326622c-1ee5-11e8-b467-0ed5f89f718b';
export const PHOTO_1 = 'a32664ca-1ee5-11e8-b467-0ed5f89f718b';
export const PHOTO_2 = 'd0d234de-1ee6-11e8-b467-0ed5f89f718b';
export const VIDEO_1 = 'a3266920-1ee5-11e8-b467-0ed5f89f718b';

const media: Array<Partial<MediaRaw>> = [
  {
    id: BLOG_1,
    kind: MediaKind.blog,
    url: 'http://some.blog',
  },
  {
    id: PHOTO_1,
    kind: MediaKind.photo,
    url: 'photo1.jpg',
    resolution: [800, 600],
    weight: 1,
  },
  {
    id: PHOTO_2,
    kind: MediaKind.photo,
    url: 'photo2.jpg',
    resolution: [1024, 768],
  },
  {
    id: VIDEO_1,
    kind: MediaKind.video,
    url: 'http://some.video',
    resolution: [1920, 1080],
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
];

export async function seed(db: Knex) {
  await db.table('media').del();
  await db.table('media_translations').del();
  await db.table('sections_media').del();

  await db.table('media').insert(media);
  await db.table('media_translations').insert([...mediaEn, ...mediaRu]);
  await db.table('sections_media').insert(sectionsMedia);
}
