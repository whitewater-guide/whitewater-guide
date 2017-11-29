import { LineString, Point } from 'wkx';
import { Coordinate3d, Duration } from '../../ww-commons';
import Knex = require('knex');

function getLineString(shape: Coordinate3d[] | null) {
  let lineString = null;
  if (shape && shape.length > 0) {
    const result: LineString = new LineString(shape.map(p => new Point(...p)));
    result.srid = 4326;
    lineString = result.toEwkt();
  }
  return lineString;
}

const sections = [
  {
    id: '2b01742c-d443-11e7-9296-cec278b6b50a',
    river_id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a', // Gal_riv_one
    gauge_id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', // Galicia gauge 1
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
    rating: '4.5',
  },
  {
    id: '3a6e3210-d529-11e7-9296-cec278b6b50a',
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
    rating: '2.5',
  },
  {
    id: '21f2351e-d52a-11e7-9296-cec278b6b50a', // Amot
    river_id: 'd4396dac-d528-11e7-9296-cec278b6b50a', // Sjoa
    season_numeric: [10, 11, 12, 13, 14, 15, 16],
    shape: getLineString([[1, 1, 0], [2, 2, 0]]),
    distance: 3.2,
    drop: 34.2,
    duration: Duration.LAPS,
    difficulty: 4,
    rating: '5',
  },
];

const sectionsEn = [
  {
    section_id: '2b01742c-d443-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Gal_riv_1_sec_1',
    description: 'Gal_riv_1_sec_1 description',
    season: 'Gal_riv_1_sec_1 season',
    flows_text: 'Gal_riv_1_sec_1 flows text',
  },
  {
    section_id: '3a6e3210-d529-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Gal_riv_1_sec_2',
    description: 'Gal_riv_1_sec_2 description',
    season: 'Gal_riv_1_sec_2 season',
    flows_text: 'Gal_riv_1_sec_2 flows text',
  },
  {
    section_id: '21f2351e-d52a-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Amot',
    description: 'Amot description',
    season: 'Amot season',
    flows_text: 'Amot flows text',
  },
];

const sectionsRu = [
  {
    section_id: '2b01742c-d443-11e7-9296-cec278b6b50a',
    language: 'ru',
    name: 'Галисия река 1 секция 1',
    description: 'Галисия река 1 секция 1 описание',
    season: 'Галисия река 1 секция 1 сезон',
    flows_text: 'Галисия река 1 секция 1 уровни',
  },
  {
    section_id: '3a6e3210-d529-11e7-9296-cec278b6b50a',
    language: 'ru',
    name: 'Галисия река 1 секция 2',
    description: 'Галисия река 1 секция 2 описание',
    season: 'Галисия река 2 секция 1 сезон',
    flows_text: 'Галисия река 1 секция 2 уровни',
  },
  {
    section_id: '21f2351e-d52a-11e7-9296-cec278b6b50a',
    language: 'ru',
    name: 'Амот',
    description: 'Амот описание',
    season: 'Амот сезон',
    flows_text: 'Амот уровни текст',
  },
];

const sectionsTags = [
  { section_id: '2b01742c-d443-11e7-9296-cec278b6b50a', tag_id: 'waterfalls' },
  { section_id: '2b01742c-d443-11e7-9296-cec278b6b50a', tag_id: 'undercuts' },
];

const sectionsPoints = [
  { section_id: '2b01742c-d443-11e7-9296-cec278b6b50a', point_id: 'ca0bee06-d445-11e7-9296-cec278b6b50a' }, // Rapid
  { section_id: '2b01742c-d443-11e7-9296-cec278b6b50a', point_id: 'ef6f80ea-d445-11e7-9296-cec278b6b50a' }, // Portage
];

export async function seed(db: Knex) {
  await db.table('sections').del();
  await db.table('sections_translations').del();
  await db.table('sections_points').del();
  await db.table('sections_tags').del();
  await db.table('sections').insert(sections);
  await db.table('sections_translations').insert(sectionsEn);
  await db.table('sections_translations').insert(sectionsRu);
  await db.table('sections_points').insert(sectionsPoints);
  await db.table('sections_tags').insert(sectionsTags);
}
