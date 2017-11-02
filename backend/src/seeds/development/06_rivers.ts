import Knex = require('knex');

const rivers = [
  {
    id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', // Galicia
  },
  {
    id: 'd69dbabc-bfe3-11e7-abc4-cec278b6b50a',
    region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', // Galicia
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
];

const riversRu = [
  {
    river_id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    language: 'ru',
    name: 'Гал_Река_Один',
  },
];

export async function seed(db: Knex) {
  await db.table('rivers').del();
  await db.table('rivers_translations').del();
  await db.table('rivers').insert(rivers);
  await db.table('rivers_translations').insert(riversEn);
  await db.table('rivers_translations').insert(riversRu);
}
