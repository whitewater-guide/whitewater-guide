import type { Knex } from 'knex';

import type { Sql } from '../../db/index';
import {
  SOURCE_GALICIA_1,
  SOURCE_GALICIA_2,
  SOURCE_GEORGIA,
  SOURCE_NORWAY,
  SOURCE_RUSSIA,
} from './05_sources';

export const GAUGE_GAL_1_1 = 'aba8c106-aaa0-11e7-abc4-cec278b6b50a';
export const GAUGE_GAL_1_2 = 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a';
export const GAUGE_NOR_1 = 'c03184b4-aaa0-11e7-abc4-cec278b6b50a';
export const GAUGE_NOR_2 = 'cc55b1c0-aaa0-11e7-abc4-cec278b6b50a';
export const GAUGE_NOR_3 = '1628c340-1a0a-11e8-accf-0ed5f89f718b';
export const GAUGE_NOR_4 = '1628cb60-1a0a-11e8-accf-0ed5f89f718b';
export const GAUGE_GAL_2_1 = '53af1e64-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_GAL_2_2 = '53af229c-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_GEO_1 = '53af2530-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_GEO_2 = '53af279c-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_GEO_3 = '53af2bb6-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_GEO_4 = '53af2e2c-19fe-11e8-accf-0ed5f89f718b';
export const GAUGE_RU_1 = 'b58d9662-c1b1-43f0-a399-dcbd12c6e113';

const gauges: Partial<Sql.Gauges>[] = [
  {
    id: GAUGE_GAL_1_1,
    source_id: SOURCE_GALICIA_1,
    location_id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a',
    code: 'gal1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ foo: 'bar' }),
    url: 'http://ya.ru',
    default_lang: 'en',
    timezone: 'Europe/Madrid',
  },
  {
    id: GAUGE_GAL_1_2,
    source_id: SOURCE_GALICIA_1,
    code: 'gal2',
    default_lang: 'en',
    timezone: 'Europe/Madrid',
  },
  {
    id: GAUGE_GAL_2_1,
    source_id: SOURCE_GALICIA_2,
    code: 'gal2_1',
    default_lang: 'en',
    timezone: 'Europe/Madrid',
  },
  {
    id: GAUGE_GAL_2_2,
    source_id: SOURCE_GALICIA_2,
    code: 'gal2_2',
    default_lang: 'en',
    timezone: 'Europe/Madrid',
  },
  {
    id: GAUGE_NOR_1,
    source_id: SOURCE_NORWAY,
    code: 'nor1',
    level_unit: 'cm',
    flow_unit: 'm3/s',
    request_params: JSON.stringify({ nor: 'way' }),
    url: 'http://yarr.ru',
    default_lang: 'en',
    timezone: 'Europe/Oslo',
  },
  {
    id: GAUGE_NOR_2,
    source_id: SOURCE_NORWAY,
    code: 'nor2',
    default_lang: 'en',
    timezone: 'Europe/Oslo',
  },
  {
    id: GAUGE_NOR_3,
    source_id: SOURCE_NORWAY,
    code: 'nor3',
    default_lang: 'en',
    timezone: 'Europe/Oslo',
  },
  {
    id: GAUGE_NOR_4,
    source_id: SOURCE_NORWAY,
    code: 'nor4',
    default_lang: 'en',
    timezone: 'Europe/Oslo',
  },
  {
    id: GAUGE_GEO_1,
    source_id: SOURCE_GEORGIA,
    code: 'geo1',
    default_lang: 'en',
    timezone: 'Asia/Tbilisi',
  },
  {
    id: GAUGE_GEO_2,
    source_id: SOURCE_GEORGIA,
    code: 'geo2',
    default_lang: 'en',
    timezone: 'Asia/Tbilisi',
  },
  {
    id: GAUGE_GEO_3,
    source_id: SOURCE_GEORGIA,
    code: 'geo3',
    default_lang: 'en',
    timezone: 'Asia/Tbilisi',
  },
  {
    id: GAUGE_GEO_4,
    source_id: SOURCE_GEORGIA,
    code: 'geo4',
    default_lang: 'en',
    timezone: 'Asia/Tbilisi',
  },
  {
    id: GAUGE_RU_1,
    source_id: SOURCE_RUSSIA,
    code: 'ru1',
    default_lang: 'ru',
    timezone: 'Europe/Moscow',
  },
];

export const TOTAL_GAUGES = gauges.length;

const gaugesEn = [
  {
    gauge_id: GAUGE_GAL_1_1,
    name: 'Galicia gauge 1',
  },
  {
    gauge_id: GAUGE_GAL_1_2,
    name: 'Galicia gauge 2',
  },
  {
    gauge_id: GAUGE_GAL_2_1,
    name: 'Galicia gauge 2 1',
  },
  {
    gauge_id: GAUGE_GAL_2_2,
    name: 'Galicia gauge 2 2',
  },
  {
    gauge_id: GAUGE_NOR_1,
    name: 'Norway gauge 1',
  },
  {
    gauge_id: GAUGE_NOR_2,
    name: 'Norway gauge 2',
  },
  {
    gauge_id: GAUGE_NOR_3,
    name: 'Norway gauge 3',
  },
  {
    gauge_id: GAUGE_NOR_4,
    name: 'Norway gauge 4',
  },
  {
    gauge_id: GAUGE_GEO_1,
    name: 'Georgian gauge 1',
  },
  {
    gauge_id: GAUGE_GEO_2,
    name: 'Georgian gauge 2',
  },
  {
    gauge_id: GAUGE_GEO_3,
    name: 'Georgian gauge 3',
  },
  {
    gauge_id: GAUGE_GEO_4,
    name: 'Georgian gauge 4',
  },
];

const gaugesRu = [
  {
    gauge_id: GAUGE_GAL_1_1,
    language: 'ru',
    name: 'Галисийская линейка 1',
  },
  {
    gauge_id: GAUGE_GAL_1_2,
    language: 'ru',
    name: 'Галисийская линейка 2',
  },
  {
    gauge_id: GAUGE_RU_1,
    language: 'ru',
    name: 'Российская линейка 1',
  },
];

export async function seed(db: Knex) {
  await db.table('gauges').del();
  await db.table('gauges_translations').del();
  await db.table('gauges').insert(gauges);
  await db.table('gauges_translations').insert(gaugesEn);
  await db.table('gauges_translations').insert(gaugesRu);
}
