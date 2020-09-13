import Knex from 'knex';

import { ADMIN_ID } from './01_users';
import {
  REGION_ECUADOR,
  REGION_GALICIA,
  REGION_GEORGIA,
  REGION_NORWAY,
} from './04_regions';

export const RIVER_SJOA = 'd4396dac-d528-11e7-9296-cec278b6b50a';
export const RIVER_FINNA = 'e7a25ab6-d528-11e7-9296-cec278b6b50a';
export const RIVER_GAL_BECA = 'a8416664-bfe3-11e7-abc4-cec278b6b50a';
export const RIVER_GAL_CABE = 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a';
export const RIVER_BZHUZHA = 'b80554ba-5db4-11e8-9c2d-fa7ae01bbebc';
export const RIVER_QUIJOS = '5ece96ad-59a7-4cc1-a092-b5cd2f464131';

const rivers = [
  {
    id: RIVER_GAL_BECA,
    region_id: REGION_GALICIA,
    created_by: ADMIN_ID,
  },
  {
    id: RIVER_GAL_CABE,
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
  {
    id: RIVER_BZHUZHA,
    region_id: REGION_GEORGIA,
  },
  {
    id: RIVER_QUIJOS,
    region_id: REGION_ECUADOR,
  },
];

export const RIVERS_TOTAL = rivers.length;

const riversEn = [
  {
    river_id: RIVER_GAL_BECA,
    language: 'en',
    name: 'Beca',
  },
  {
    river_id: RIVER_GAL_CABE,
    language: 'en',
    name: 'Cabe',
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
  {
    river_id: RIVER_BZHUZHA,
    language: 'en',
    name: 'Bzhuzha',
  },
  {
    river_id: RIVER_QUIJOS,
    language: 'en',
    name: 'Quijos',
  },
];

const riversRu = [
  {
    river_id: RIVER_GAL_BECA,
    language: 'ru',
    name: 'Беса',
  },
  {
    river_id: RIVER_SJOA,
    language: 'ru',
    name: 'Шоа',
  },
  {
    river_id: RIVER_BZHUZHA,
    language: 'ru',
    name: 'Бжужа',
  },
];

export async function seed(db: Knex) {
  await db.table('rivers').del();
  await db.table('rivers_translations').del();
  await db.table('rivers').insert(rivers);
  await db.table('rivers_translations').insert(riversEn);
  await db.table('rivers_translations').insert(riversRu);
}
