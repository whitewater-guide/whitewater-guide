import Knex from 'knex';
import { HarvestMode } from '../../ww-commons';

export const SOURCE_GALICIA_1 = '6d0d717e-aa9d-11e7-abc4-cec278b6b50a';
export const SOURCE_GALICIA_2 = '9f962a34-bff9-11e7-abc4-cec278b6b50a';
export const SOURCE_ALPS = '1628c0a2-1a0a-11e8-accf-0ed5f89f718b';
export const SOURCE_NORWAY = '786251d4-aa9d-11e7-abc4-cec278b6b50a';
export const SOURCE_GEORGIA = '53af1a54-19fe-11e8-accf-0ed5f89f718b';
export const SOURCE_RUSSIA = '8e37e9d2-1d7b-11e8-b467-0ed5f89f718b';

const sources = [
  {
    id: SOURCE_GALICIA_1,
    script: 'galicia',
    cron: '0 * * * *',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    url: 'http://ya.ru',
    enabled: false,
  },
  {
    id: SOURCE_GALICIA_2,
    script: 'galicia2',
    cron: null,
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    url: 'http://yandex.ru',
    enabled: true,
  },
  {
    id: SOURCE_ALPS,
    script: 'alps',
    cron: '10 * * * *',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    url: 'http://yandex.ru',
    enabled: true,
  },
  {
    id: SOURCE_NORWAY,
    script: 'norway',
    harvest_mode: HarvestMode.ONE_BY_ONE,
    enabled: true,
  },
  {
    id: SOURCE_GEORGIA,
    script: 'one_by_one',
    harvest_mode: HarvestMode.ONE_BY_ONE,
    enabled: false,
  },
  {
    id: SOURCE_RUSSIA,
    script: 'one_by_one',
    harvest_mode: HarvestMode.ONE_BY_ONE,
    enabled: false,
  },
];

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
    source_id: SOURCE_RUSSIA,
    name: 'Russia',
  },
];

const sourcesRu = [
  {
    source_id: SOURCE_GALICIA_1,
    language: 'ru',
    name: 'Галисия',
    terms_of_use: 'Правила пользования галисией',
  },
];

// connects sources 'galicia' and 'norway' to region 'Norway'
// connects sources 'galicia' and 'galicia2' to region 'galicia'
const sourcesRegions = [
  { source_id: SOURCE_GALICIA_1, region_id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
  { source_id: SOURCE_GALICIA_1, region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' },
  { source_id: SOURCE_GALICIA_2, region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' },
  { source_id: SOURCE_NORWAY, region_id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
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
