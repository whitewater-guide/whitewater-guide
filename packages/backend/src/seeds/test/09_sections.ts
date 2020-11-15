import { Coordinate3d, Duration } from '@whitewater-guide/commons';
import Knex from 'knex';
import { LineString, Point } from 'wkx';

import { ADMIN_ID, TEST_USER2_ID } from './01_users';
import {
  LOWER_BECA_PT_1,
  LOWER_BECA_PT_2,
  RUSSIA_MZYMTA_PASEKA_PT_1,
} from './02_points';
import { GAUGE_GAL_1_1, GAUGE_GEO_1, GAUGE_GEO_4 } from './06_gauges';
import {
  RIVER_BZHUZHA,
  RIVER_FINNA,
  RIVER_GAL_BECA,
  RIVER_MZYMTA,
  RIVER_QUIJOS,
  RIVER_SJOA,
} from './07_rivers';

function getLineString(shape: Coordinate3d[] | null) {
  let lineString = null;
  if (shape && shape.length > 0) {
    const result: LineString = new LineString(
      shape.map((p) => new Point(...p)),
    );
    result.srid = 4326;
    lineString = result.toEwkt();
  }
  return lineString;
}

export const GALICIA_BECA_LOWER = '2b01742c-d443-11e7-9296-cec278b6b50a';
export const GALICIA_BECA_UPPER = '3a6e3210-d529-11e7-9296-cec278b6b50a';
export const NORWAY_SJOA_AMOT = '21f2351e-d52a-11e7-9296-cec278b6b50a';
export const NORWAY_FINNA_GORGE = '8688e656-5b4b-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_LONG = 'e6e0e826-5db4-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_QUALI = 'f73b533c-5db4-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_EXTREME = '9e9c0366-84e2-11e8-adc0-fa7ae01bbebc';
export const ECUADOR_QUIJOS_BRIDGE = '7104f00c-31ad-4375-992e-5efebef813dd';
export const ECUADOR_QUIJOS_CHEESE = '2ffe67e5-6394-4341-9ae3-415271ce71fd';
export const RUSSIA_MZYMTA_PASEKA = 'b06c0a6e-9975-4a46-8a77-580a4f453973';

export const SECTIONS_TOTAL = 10;
export const SECTIONS_VISIBLE = 9;
export const SECTIONS_HIDDEN = 1;
export const SECTIONS_DEMO = 3;

const sections = [
  {
    id: GALICIA_BECA_LOWER,
    river_id: RIVER_GAL_BECA,
    gauge_id: GAUGE_GAL_1_1,
    season_numeric: [0, 1, 2, 3, 4],
    levels: {
      minimum: 10,
      maximum: 30,
      optimum: 20,
      impossible: 40,
      approximate: false,
    },
    flows: {
      minimum: 10,
      maximum: 30,
      optimum: 20,
      impossible: 40,
      approximate: false,
    },
    shape: getLineString([
      [10, 10, 0],
      [20, 20, 0],
    ]),
    distance: 11.1,
    drop: 12.2,
    duration: Duration.TWICE,
    difficulty: 3.5,
    difficulty_xtra: 'X',
    rating: 4.5,
    created_by: ADMIN_ID,
    verified: false,
    default_lang: 'en',
  },
  {
    id: GALICIA_BECA_UPPER,
    river_id: RIVER_GAL_BECA,
    gauge_id: GAUGE_GAL_1_1,
    season_numeric: [0, 1, 2, 3, 4],
    levels: {
      minimum: 100,
      maximum: 300,
      optimum: 200,
      impossible: 400,
      approximate: false,
    },
    flows: {
      minimum: 100,
      maximum: 300,
      optimum: 200,
      impossible: 400,
      approximate: false,
    },
    shape: getLineString([
      [20, 20, 0],
      [21, 21, 0],
    ]),
    distance: 1.1,
    drop: 22.2,
    duration: Duration.DAYRUN,
    difficulty: 4.5,
    difficulty_xtra: 'VI',
    rating: 2.5,
    verified: true,
    default_lang: 'en',
  },
  {
    id: NORWAY_SJOA_AMOT,
    river_id: RIVER_SJOA,
    season_numeric: [10, 11, 12, 13, 14, 15, 16],
    shape: getLineString([
      [1, 1, 0],
      [2, 2, 0],
    ]),
    distance: 3.2,
    drop: 34.2,
    duration: Duration.LAPS,
    difficulty: 4,
    rating: 5,
    help_needed: 'Suggest POIs please',
    created_by: TEST_USER2_ID,
    default_lang: 'en',
  },
  {
    id: NORWAY_FINNA_GORGE,
    river_id: RIVER_FINNA,
    season_numeric: [11, 12, 13, 14, 15, 16],
    shape: getLineString([
      [2, 2, 0],
      [3, 3, 0],
    ]),
    distance: 5.5,
    drop: 334.2,
    duration: Duration.DAYRUN,
    difficulty: 4,
    rating: 4,
    hidden: true,
    default_lang: 'en',
  },
  {
    id: GEORGIA_BZHUZHA_LONG,
    river_id: RIVER_BZHUZHA,
    gauge_id: GAUGE_GEO_1,
    season_numeric: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
    shape: getLineString([
      [12, 21, 110],
      [34, 43, 10],
    ]),
    distance: 2.45,
    drop: 101,
    duration: Duration.LAPS,
    difficulty: 3.5,
    difficulty_xtra: 'IV',
    rating: 5,
    hidden: false,
    demo: false,
    default_lang: 'en',
  },
  {
    id: GEORGIA_BZHUZHA_EXTREME,
    river_id: RIVER_BZHUZHA,
    gauge_id: GAUGE_GEO_4,
    season_numeric: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
    shape: getLineString([
      [12.1, 21, 110],
      [34, 43, 10],
    ]),
    distance: 1.15,
    drop: 332,
    duration: Duration.LAPS,
    difficulty: 4.5,
    rating: 5,
    hidden: false,
    demo: false,
    default_lang: 'en',
  },
  {
    id: GEORGIA_BZHUZHA_QUALI,
    river_id: RIVER_BZHUZHA,
    season_numeric: [
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
    shape: getLineString([
      [32, 23, 210],
      [15, 51, 100],
    ]),
    distance: 1.45,
    drop: 55,
    duration: Duration.LAPS,
    difficulty: 2.5,
    rating: 5,
    hidden: false,
    demo: true,
    default_lang: 'en',
  },
  {
    id: ECUADOR_QUIJOS_BRIDGE,
    river_id: RIVER_QUIJOS,
    season_numeric: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
    shape: getLineString([
      [-77.9205, -0.4607, 0],
      [-77.8961, -0.4594, 0],
    ]),
    distance: 3.2,
    drop: null,
    duration: Duration.LAPS,
    difficulty: 4.5,
    rating: 4,
    hidden: false,
    demo: true,
    default_lang: 'en',
  },
  {
    id: ECUADOR_QUIJOS_CHEESE,
    river_id: RIVER_QUIJOS,
    season_numeric: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
    shape: getLineString([
      [-77.967, -0.4376, 0],
      [-77.9322, -0.4593, 0],
    ]),
    distance: 5,
    drop: null,
    duration: Duration.LAPS,
    difficulty: 4.5,
    rating: 4.5,
    hidden: false,
    demo: true,
    default_lang: 'en',
  },
  {
    id: RUSSIA_MZYMTA_PASEKA,
    river_id: RIVER_MZYMTA,
    season_numeric: [
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
    ],
    shape: getLineString([
      [43.6465, 40.3454, 0],
      [43.6613, 40.3404, 0],
    ]),
    distance: 2.2,
    drop: null,
    duration: Duration.LAPS,
    difficulty: 4,
    rating: 4,
    hidden: false,
    demo: false,
    default_lang: 'ru',
  },
];

const sectionsEn = [
  {
    section_id: GALICIA_BECA_LOWER,
    language: 'en',
    name: 'Lower',
    alt_names: ['Long one'],
    description: 'Lower Beca description',
    season: 'Lower Beca season',
    flows_text: 'Lower Beca flows text',
  },
  {
    section_id: GALICIA_BECA_UPPER,
    language: 'en',
    name: 'Upper',
    description: null,
    season: 'Upper Beca season',
    flows_text: 'Upper Beca flows text',
  },
  {
    section_id: NORWAY_SJOA_AMOT,
    language: 'en',
    name: 'Amot',
    description: 'Amot description',
    season: 'Amot season',
    flows_text: 'Amot flows text',
  },
  {
    section_id: NORWAY_FINNA_GORGE,
    language: 'en',
    name: 'Gorge',
    description: 'Finna gorge description',
    season: 'Finna gorge season',
    flows_text: 'Finna gorge flows text',
  },
  {
    section_id: GEORGIA_BZHUZHA_LONG,
    language: 'en',
    name: 'Long Race',
    description: null,
    season: 'Bzhuzha long race season',
    flows_text: 'Bzhuzha long race flows text',
  },
  {
    section_id: GEORGIA_BZHUZHA_QUALI,
    language: 'en',
    name: 'Qualification',
    description: 'Bzhuzha Qualification description',
    season: 'Bzhuzha Qualification season',
    flows_text: 'Bzhuzha Qualification flows text',
  },
  {
    section_id: GEORGIA_BZHUZHA_EXTREME,
    language: 'en',
    name: 'Extreme race',
    description: 'Bzhuzha Extreme race description',
    season: 'Bzhuzha Extreme race season',
    flows_text: 'Bzhuzha Extreme race flows text',
  },
  {
    section_id: ECUADOR_QUIJOS_CHEESE,
    language: 'en',
    name: 'Cheese house',
    description: 'Quijos Cheese House description',
    season: 'Quijos Cheese House season',
    flows_text: 'Quijos Cheese House flows text',
  },
  {
    section_id: ECUADOR_QUIJOS_BRIDGE,
    language: 'en',
    name: 'Bridge to bridge',
    description: 'Quijos Bridge to bridge description',
    season: 'Quijos Bridge to bridge season',
    flows_text: 'Quijos Bridge to bridge flows text',
  },
];

const sectionsRu = [
  {
    section_id: GALICIA_BECA_LOWER,
    language: 'ru',
    name: 'Нижняя',
    description: 'Нижняя Беса описание',
    season: 'Нижняя Беса сезон',
    flows_text: 'Нижняя Беса уровни',
  },
  {
    section_id: GALICIA_BECA_UPPER,
    language: 'ru',
    name: 'Верхняя',
    description: null,
    season: 'Верхняя Беса сезон',
    flows_text: 'Верхняя Беса уровни',
  },
  {
    section_id: NORWAY_SJOA_AMOT,
    language: 'ru',
    name: 'Амот',
    description: 'Амот описание',
    season: 'Амот сезон',
    flows_text: 'Амот уровни текст',
  },
  {
    section_id: GEORGIA_BZHUZHA_LONG,
    language: 'ru',
    name: 'Длинная гонка',
    description: null,
    season: 'Бжужа Длинная гонка сезонность',
    flows_text: 'Бжужа Длинная гонка уровни',
  },
  {
    section_id: GEORGIA_BZHUZHA_QUALI,
    language: 'ru',
    name: 'Квалификация',
    description: 'Бжужа Квалификация описание',
    season: 'Бжужа Квалификация сезонность',
    flows_text: 'Бжужа Квалификация уровни',
  },
  {
    section_id: GEORGIA_BZHUZHA_EXTREME,
    language: 'ru',
    name: 'Экстрим',
    description: 'Бжужа Экстрим описание',
    season: 'Бжужа Экстрим сезонность',
    flows_text: 'Бжужа Экстрим уровни',
  },
  {
    section_id: RUSSIA_MZYMTA_PASEKA,
    language: 'ru',
    name: 'Пасека',
    description: 'Пасека описание',
    season: 'Пасека сезонность',
    flows_text: 'Пасека уровни',
    created_at: '2019-01-01',
  },
];

// Only for galician river 1 section 1
const sectionsTags = [
  { section_id: GALICIA_BECA_LOWER, tag_id: 'waterfalls' },
  { section_id: GALICIA_BECA_LOWER, tag_id: 'undercuts' },
];

// Only for galician river 1 section 1
const sectionsPoints = [
  {
    section_id: GALICIA_BECA_LOWER,
    point_id: LOWER_BECA_PT_1,
  }, // Rapid
  {
    section_id: GALICIA_BECA_LOWER,
    point_id: LOWER_BECA_PT_2,
  }, // Portage
  {
    section_id: RUSSIA_MZYMTA_PASEKA,
    point_id: RUSSIA_MZYMTA_PASEKA_PT_1,
  }, // Portage
];

export async function seed(db: Knex) {
  await db.table('sections').del();
  await db.table('sections_translations').del();
  await db.table('sections_points').del();
  await db.table('sections_tags').del();
  await db.table('sections').insert(sections);
  await db
    .table('sections_translations')
    .insert([...sectionsEn, ...sectionsRu]);
  await db.table('sections_points').insert(sectionsPoints);
  await db.table('sections_tags').insert(sectionsTags);
}
