import Knex = require('knex');

const measurements = [
  { script: 'galicia', gauge_code: 'gal1', time: '2018-01-01 00:00:00', flow: null, level: 1.2 },
  { script: 'galicia', gauge_code: 'gal1', time: '2018-01-01 01:00:00', flow: 10.1, level: 1.3 },
  { script: 'galicia', gauge_code: 'gal1', time: '2018-01-01 03:00:00', flow: 10.1, level: null },
  { script: 'galicia', gauge_code: 'gal2', time: '2018-01-01 01:00:00', flow: 22,   level: 33 },
  { script: 'galicia', gauge_code: 'gal2', time: '2018-01-01 02:00:00', flow: 22.1, level: 33.3 },
  { script: 'galicia', gauge_code: 'gal2', time: '2018-01-01 03:00:00', flow: 22.9, level: 35.6 },
];

export async function seed(db: Knex) {
  await db.table('measurements').del();
  await db.table('measurements').insert(measurements);
}
