import Knex = require('knex');
import { HarvestMode } from '../../features/sources/index';

const sources = [
  {
    id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    script: 'galicia',
    cron: '0 * * * *',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    url: 'http://ya.ru',
    enabled: false,
  },
  {
    id: '786251d4-aa9d-11e7-abc4-cec278b6b50a',
    script: 'norway',
    harvest_mode: HarvestMode.ALL_AT_ONCE,
    enabled: true,
  },
];

const sourcesEn = [
  {
    source_id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    name: 'Galicia',
    terms_of_use: 'Terms of use for Galicia',
  },
  {
    source_id: '786251d4-aa9d-11e7-abc4-cec278b6b50a',
    name: 'Norway',
  },
];

const sourcesRu = [
  {
    source_id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    language: 'ru',
    name: 'Галисия',
    terms_of_use: 'Правила пользования галисией',
  },
];

// connect both sources to regiion 'Hidden region'
const sourcesRegions = [
  { source_id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a', region_id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
  { source_id: '786251d4-aa9d-11e7-abc4-cec278b6b50a', region_id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
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
