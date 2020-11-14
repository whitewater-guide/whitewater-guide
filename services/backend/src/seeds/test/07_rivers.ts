import Knex from 'knex';
import { ADMIN_ID } from './01_users';
import {
  REGION_ECUADOR,
  REGION_GALICIA,
  REGION_GEORGIA,
  REGION_NORWAY,
  REGION_RUSSIA,
} from './04_regions';

export const RIVER_SJOA = 'd4396dac-d528-11e7-9296-cec278b6b50a';
export const RIVER_FINNA = 'e7a25ab6-d528-11e7-9296-cec278b6b50a';
export const RIVER_GAL_BECA = 'a8416664-bfe3-11e7-abc4-cec278b6b50a';
export const RIVER_GAL_CABE = 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a';
export const RIVER_BZHUZHA = 'b80554ba-5db4-11e8-9c2d-fa7ae01bbebc';
export const RIVER_QUIJOS = '5ece96ad-59a7-4cc1-a092-b5cd2f464131';
export const RIVER_MZYMTA = '72d18088-eebb-4f62-a359-186bc93ccb71';

const rivers = [
  {
    id: RIVER_GAL_BECA,
    region_id: REGION_GALICIA,
    created_by: ADMIN_ID,
    default_lang: 'en',
  },
  {
    id: RIVER_GAL_CABE,
    region_id: REGION_GALICIA,
    default_lang: 'en',
  },
  {
    id: RIVER_SJOA,
    region_id: REGION_NORWAY,
    default_lang: 'en',
  },
  {
    id: RIVER_FINNA,
    region_id: REGION_NORWAY,
    default_lang: 'en',
  },
  {
    id: RIVER_BZHUZHA,
    region_id: REGION_GEORGIA,
    default_lang: 'en',
  },
  {
    id: RIVER_QUIJOS,
    region_id: REGION_ECUADOR,
    default_lang: 'en',
  },
  {
    id: RIVER_MZYMTA,
    region_id: REGION_RUSSIA,
    default_lang: 'ru',
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
  {
    river_id: RIVER_MZYMTA,
    language: 'en',
    name: 'Mzymta',
    created_at: '2020-01-01',
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
  {
    river_id: RIVER_MZYMTA,
    language: 'ru',
    name: 'Мзымта',
    created_at: '2019-01-01',
  },
];

export async function seed(db: Knex) {
  await db.table('rivers').del();
  await db.table('rivers_translations').del();
  await db.table('rivers').insert(rivers);
  await db.table('rivers_translations').insert(riversEn);
  await db.table('rivers_translations').insert(riversRu);
}
