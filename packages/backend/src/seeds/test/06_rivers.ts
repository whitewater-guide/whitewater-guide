import Knex from 'knex';
import { ADMIN_ID } from './01_users';
import { REGION_GALICIA, REGION_NORWAY } from './03_regions';

export const RIVER_SJOA = 'd4396dac-d528-11e7-9296-cec278b6b50a';
export const RIVER_FINNA = 'e7a25ab6-d528-11e7-9296-cec278b6b50a';
export const RIVER_GAL_1 = 'a8416664-bfe3-11e7-abc4-cec278b6b50a';
export const RIVER_GAL_2 = 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a';

const rivers = [
  {
    id: RIVER_GAL_1,
    region_id: REGION_GALICIA,
    created_by: ADMIN_ID,
  },
  {
    id: RIVER_GAL_2,
    region_id: REGION_GALICIA,
  },
  {
    id: RIVER_SJOA,
    region_id: REGION_NORWAY,
  },
  {
    id: RIVER_FINNA,
    region_id: REGION_NORWAY,
  },
];

const riversEn = [
  {
    river_id: RIVER_GAL_1,
    language: 'en',
    name: 'Gal_Riv_One',
  },
  {
    river_id: RIVER_GAL_2,
    language: 'en',
    name: 'Gal_riv_two',
  },
  {
    river_id: RIVER_SJOA,
    language: 'en',
    name: 'Sjoa',
    alt_names: ['Shoa', 'Sjøa'],
  },
  {
    river_id: RIVER_FINNA,
    language: 'en',
    name: 'Finna',
  },
];

const riversRu = [
  {
    river_id: RIVER_GAL_1,
    language: 'ru',
    name: 'Гал_Река_Один',
  },
  {
    river_id: RIVER_SJOA,
    language: 'ru',
    name: 'Шоа',
  },
];

export async function seed(db: Knex) {
  await db.table('rivers').del();
  await db.table('rivers_translations').del();
  await db.table('rivers').insert(rivers);
  await db.table('rivers_translations').insert(riversEn);
  await db.table('rivers_translations').insert(riversRu);
}
