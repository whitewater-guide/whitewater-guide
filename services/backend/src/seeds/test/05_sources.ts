import Knex from 'knex';
import { REGION_GALICIA, REGION_GEORGIA, REGION_NORWAY } from './04_regions';

export const SOURCE_GALICIA_1 = '6d0d717e-aa9d-11e7-abc4-cec278b6b50a';
export const SOURCE_GALICIA_2 = '9f962a34-bff9-11e7-abc4-cec278b6b50a';
export const SOURCE_ALPS = '1628c0a2-1a0a-11e8-accf-0ed5f89f718b';
export const SOURCE_NORWAY = '786251d4-aa9d-11e7-abc4-cec278b6b50a';
export const SOURCE_GEORGIA = '53af1a54-19fe-11e8-accf-0ed5f89f718b';
export const SOURCE_RUSSIA = '8e37e9d2-1d7b-11e8-b467-0ed5f89f718b';
export const SOURCE_EMPTY = 'ce81ed89-5558-49d1-86f6-1fa8bcd944bb';

const sources = [
  {
    id: SOURCE_GALICIA_1,
    script: 'galicia',
    cron: '0 * * * *',
    url: 'http://ya.ru',
    default_lang: 'en',
  },
  {
    id: SOURCE_GALICIA_2,
    script: 'galicia2',
    cron: null,
    url: 'http://yandex.ru',
    default_lang: 'en',
  },
  {
    id: SOURCE_ALPS,
    script: 'alps',
    cron: '10 * * * *',
    url: 'http://yandex.ru',
    default_lang: 'en',
  },
  {
    id: SOURCE_NORWAY,
    script: 'norway',
    default_lang: 'en',
  },
  {
    id: SOURCE_GEORGIA,
    script: 'one_by_one',
    default_lang: 'en',
  },
  {
    id: SOURCE_RUSSIA,
    script: 'russia',
    request_params: JSON.stringify({ foo: 'bar' }),
    default_lang: 'ru',
  },
  {
    id: SOURCE_EMPTY,
    script: 'empty',
    request_params: JSON.stringify({ foo: 'bar' }),
    default_lang: 'en',
  },
];

export const TOTAL_SOURCES = sources.length;

const sourcesEn = [
  {
    source_id: SOURCE_GALICIA_1,
    name: 'Galicia',
    terms_of_use: 'Terms of use for Galicia',
  },
  {
    source_id: SOURCE_GALICIA_2,
    name: 'Galicia2',
    terms_of_use: 'Terms of use for Galicia2',
  },
  {
    source_id: SOURCE_NORWAY,
    name: 'Norway',
  },
  {
    source_id: SOURCE_GEORGIA,
    name: 'Georgia',
  },
  {
    source_id: SOURCE_ALPS,
    name: 'Alps',
  },
  {
    source_id: SOURCE_EMPTY,
    name: 'Empty',
  },
];

const sourcesRu = [
  {
    source_id: SOURCE_GALICIA_1,
    language: 'ru',
    name: 'Галисия',
    terms_of_use: 'Правила пользования галисией',
  },
  {
    source_id: SOURCE_RUSSIA,
    language: 'ru',
    name: 'Россия',
  },
];

const sourcesRegions = [
  {
    source_id: SOURCE_GALICIA_1,
    region_id: REGION_NORWAY,
  },
  {
    source_id: SOURCE_GALICIA_1,
    region_id: REGION_GALICIA,
  },
  {
    source_id: SOURCE_GALICIA_2,
    region_id: REGION_GALICIA,
  },
  {
    source_id: SOURCE_NORWAY,
    region_id: REGION_NORWAY,
  },
  {
    source_id: SOURCE_GEORGIA,
    region_id: REGION_GEORGIA,
  },
];

export async function seed(db: Knex) {
  await db.table('sources').del();
  await db.table('sources_translations').del();
  await db.table('sources_regions').del();
  await db.table('sources').insert(sources);
  await db.table('sources_translations').insert(sourcesEn);
  await db.table('sources_translations').insert(sourcesRu);
  await db.table('sources_regions').insert(sourcesRegions);
}
