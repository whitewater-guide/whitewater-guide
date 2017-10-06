import Knex = require('knex');

const gauges = [
  {
    id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a',
    source_id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    code: 'gal1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ foo: 'bar' }),
    url: 'http://ya.ru',
    enabled: false,
  },
  {
    id: 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a',
    source_id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
    code: 'gal2',
    enabled: false,
  },
  {
    id: 'c03184b4-aaa0-11e7-abc4-cec278b6b50a',
    source_id: '786251d4-aa9d-11e7-abc4-cec278b6b50a',
    code: 'nor1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ nor: 'way' }),
    url: 'http://yarr.ru',
    enabled: true,
  },
  {
    id: 'cc55b1c0-aaa0-11e7-abc4-cec278b6b50a',
    source_id: '786251d4-aa9d-11e7-abc4-cec278b6b50a',
    code: 'nor2',
    enabled: true,
  },
];

const gaugesEn = [
  {
    gauge_id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a',
    name: 'Galicia gauge 1',
  },
  {
    gauge_id: 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a',
    name: 'Galicia gauge 2',
  },
  {
    gauge_id: 'c03184b4-aaa0-11e7-abc4-cec278b6b50a',
    name: 'Norway gauge 1',
  },
  {
    gauge_id: 'cc55b1c0-aaa0-11e7-abc4-cec278b6b50a',
    name: 'Norway gauge 2',
  },
];

const gaugesRu = [
  {
    gauge_id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a',
    language: 'ru',
    name: 'Галисийская линейка 1',
  },
  {
    gauge_id: 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a',
    language: 'ru',
    name: 'Галисийская линейка 2',
  },
];

export async function seed(db: Knex) {
  await db.table('gauges').del();
  await db.table('gauges_translations').del();
  await db.table('gauges').insert(gauges);
  await db.table('gauges_translations').insert(gaugesEn);
  await db.table('gauges_translations').insert(gaugesRu);
}
