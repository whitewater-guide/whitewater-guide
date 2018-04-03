import Knex from 'knex';
import { REGION_GALICIA, REGION_NORWAY } from './03_regions';

const rivers = [
  {
    id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    region_id: REGION_GALICIA,
  },
  {
    id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a',
    region_id: REGION_GALICIA,
  },
  {
    id: 'd4396dac-d528-11e7-9296-cec278b6b50a', // Sjoa
    region_id: REGION_NORWAY,
  },
  {
    id: 'e7a25ab6-d528-11e7-9296-cec278b6b50a', // Finna
    region_id: REGION_NORWAY, // Norway
  },
];

const riversEn = [
  {
    river_id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    language: 'en',
    name: 'Gal_Riv_One',
  },
  {
    river_id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a',
    language: 'en',
    name: 'Gal_riv_two',
  },
  {
    river_id: 'd4396dac-d528-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Sjoa',
    alt_names: ['Shoa', 'Sjøa'],
  },
  {
    river_id: 'e7a25ab6-d528-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Finna',
  },
];

const riversRu = [
  {
    river_id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    language: 'ru',
    name: 'Гал_Река_Один',
  },
  {
    river_id: 'd4396dac-d528-11e7-9296-cec278b6b50a',
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
