import { Coordinate3d, Duration } from '@whitewater-guide/commons';
import Knex from 'knex';
import { LineString, Point } from 'wkx';
import { ADMIN_ID } from './01_users';
import { GAUGE_GAL_1_1, GAUGE_GEO_1, GAUGE_GEO_4 } from './06_gauges';
import { RIVER_BZHUZHA, RIVER_FINNA, RIVER_GAL_1 } from './07_rivers';

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

export const GALICIA_R1_S1 = '2b01742c-d443-11e7-9296-cec278b6b50a';
export const GALICIA_R1_S2 = '3a6e3210-d529-11e7-9296-cec278b6b50a';
export const NORWAY_SJOA_AMOT = '21f2351e-d52a-11e7-9296-cec278b6b50a';
export const NORWAY_FINNA_GORGE = '8688e656-5b4b-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_LONG = 'e6e0e826-5db4-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_QUALI = 'f73b533c-5db4-11e8-9c2d-fa7ae01bbebc';
export const GEORGIA_BZHUZHA_EXTREME = '9e9c0366-84e2-11e8-adc0-fa7ae01bbebc';

export const SECTIONS_TOTAL = 7;
export const SECTIONS_VISIBLE = 6;
export const SECTIONS_HIDDEN = 1;
export const SECTIONS_DEMO = 1;

const sections = [
  {
    id: GALICIA_R1_S1,
    river_id: RIVER_GAL_1,
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
    shape: getLineString([[10, 10, 0], [20, 20, 0]]),
    distance: 11.1,
    drop: 12.2,
    duration: Duration.TWICE,
    difficulty: 3.5,
    difficulty_xtra: 'X',
    rating: 4.5,
    created_by: ADMIN_ID,
  },
  {
    id: GALICIA_R1_S2,
    river_id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a', // Gal_riv_one
    gauge_id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', // Galicia gauge 1
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
    shape: getLineString([[20, 20, 0], [21, 21, 0]]),
    distance: 1.1,
    drop: 22.2,
    duration: Duration.DAYRUN,
    difficulty: 4.5,
    difficulty_xtra: 'VI',
    rating: 2.5,
  },
  {
    id: NORWAY_SJOA_AMOT, // Amot
    river_id: 'd4396dac-d528-11e7-9296-cec278b6b50a', // Sjoa
    season_numeric: [10, 11, 12, 13, 14, 15, 16],
    shape: getLineString([[1, 1, 0], [2, 2, 0]]),
    distance: 3.2,
    drop: 34.2,
    duration: Duration.LAPS,
    difficulty: 4,
    rating: 5,
  },
  {
    id: NORWAY_FINNA_GORGE,
    river_id: RIVER_FINNA,
    season_numeric: [11, 12, 13, 14, 15, 16],
    shape: getLineString([[2, 2, 0], [3, 3, 0]]),
    distance: 5.5,
    drop: 334.2,
    duration: Duration.DAYRUN,
    difficulty: 4,
    rating: 4,
    hidden: true,
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
    shape: getLineString([[12, 21, 110], [34, 43, 10]]),
    distance: 2.45,
    drop: 101,
    duration: Duration.LAPS,
    difficulty: 3.5,
    difficulty_xtra: 'IV',
    rating: 5,
    hidden: false,
    demo: false,
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
    shape: getLineString([[12.1, 21, 110], [34, 43, 10]]),
    distance: 1.15,
    drop: 332,
    duration: Duration.LAPS,
    difficulty: 4.5,
    rating: 5,
    hidden: false,
    demo: false,
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
    shape: getLineString([[32, 23, 210], [15, 51, 100]]),
    distance: 1.45,
    drop: 55,
    duration: Duration.LAPS,
    difficulty: 2.5,
    rating: 5,
    hidden: false,
    demo: true,
  },
];

const sectionsEn = [
  {
    section_id: GALICIA_R1_S1,
    language: 'en',
    name: 'Gal_riv_1_sec_1',
    description: 'Gal_riv_1_sec_1 description',
    season: 'Gal_riv_1_sec_1 season',
    flows_text: 'Gal_riv_1_sec_1 flows text',
  },
  {
    section_id: GALICIA_R1_S2,
    language: 'en',
    name: 'Gal_riv_1_sec_2',
    description: null,
    season: 'Gal_riv_1_sec_2 season',
    flows_text: 'Gal_riv_1_sec_2 flows text',
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
];

const sectionsRu = [
  {
    section_id: GALICIA_R1_S1,
    language: 'ru',
    name: 'Галисия река 1 секция 1',
    description: 'Галисия река 1 секция 1 описание',
    season: 'Галисия река 1 секция 1 сезон',
    flows_text: 'Галисия река 1 секция 1 уровни',
  },
  {
    section_id: GALICIA_R1_S2,
    language: 'ru',
    name: 'Галисия река 1 секция 2',
    description: null,
    season: 'Галисия река 2 секция 1 сезон',
    flows_text: 'Галисия река 1 секция 2 уровни',
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
];

// Only for galician river 1 section 1
const sectionsTags = [
  { section_id: GALICIA_R1_S1, tag_id: 'waterfalls' },
  { section_id: GALICIA_R1_S1, tag_id: 'undercuts' },
];

// Only for galician river 1 section 1
const sectionsPoints = [
  {
    section_id: GALICIA_R1_S1,
    point_id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
  }, // Rapid
  {
    section_id: GALICIA_R1_S1,
    point_id: 'ef6f80ea-d445-11e7-9296-cec278b6b50a',
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
