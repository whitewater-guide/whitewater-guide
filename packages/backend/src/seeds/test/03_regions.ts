import Knex from 'knex';
import { Point, Polygon } from 'wkx';
import { Coordinate3d } from '../../ww-commons';
import { ADMIN_ID, TEST_USER_ID } from './01_users';
import { ECUADOR_PT_1, GALICIA_PT_1, GALICIA_PT_2 } from './02_points';

function getBounds(bounds: Coordinate3d[] | null) {
  let rawBounds = null;
  if (bounds && bounds.length > 0) {
    const polygon: Polygon = new Polygon(bounds.map(p => new Point(...p)));
    // Close the ring
    polygon.exteriorRing.push(new Point(...bounds[0]));
    polygon.srid = 4326;
    rawBounds = polygon.toEwkt();
  }
  return rawBounds;
}

export const REGION_GALICIA = 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34';
export const REGION_ECUADOR = '2caf75ca-7625-11e7-b5a5-be2e44b06b34';
export const REGION_NORWAY = 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34';

const regions = [
  {
    id: REGION_GALICIA,
    hidden: false,
    premium: false,
    season_numeric: [20, 21],
    bounds: getBounds([[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]]),
  },
  {
    id: REGION_ECUADOR,
    hidden: false,
    premium: true,
    season_numeric: [],
    bounds: null,
  },
  {
    id: REGION_NORWAY,
    hidden: true,
    premium: true,
    season_numeric: [],
    bounds: null,
  },
];

const regionsEn = [
  {
    region_id: REGION_GALICIA,
    language: 'en',
    name: 'Galicia',
    description: 'Description of Galicia',
    season: 'Late autumn - early spring',
  },
  {
    region_id: REGION_ECUADOR,
    language: 'en',
    name: 'Ecuador',
    description: null,
    season: null,
  },
  {
    region_id: REGION_NORWAY,
    language: 'en',
    name: 'Norway',
    description: null,
    season: null,
  },
];

const regionsRu = [
  {
    region_id: REGION_GALICIA,
    language: 'ru',
    name: 'Галисия',
    description: 'описание Галисии',
    season: 'осень весна',
  },
];

const regionsPoints = [
  { region_id: REGION_GALICIA, point_id: GALICIA_PT_1 },
  { region_id: REGION_GALICIA, point_id: GALICIA_PT_2 },
  { region_id: REGION_ECUADOR, point_id: ECUADOR_PT_1 },
];

const regionsEditors = [
  { region_id: REGION_GALICIA, user_id: ADMIN_ID },
  { region_id: REGION_ECUADOR, user_id: ADMIN_ID },
  { region_id: REGION_ECUADOR, user_id: TEST_USER_ID },
  { region_id: REGION_NORWAY, user_id: TEST_USER_ID },
];

export async function seed(db: Knex) {
  await db.table('regions').del();
  await db.table('regions_translations').del();
  await db.table('regions').insert(regions);
  await db.table('regions_translations').insert(regionsEn);
  await db.table('regions_translations').insert(regionsRu);
  await db.table('regions_points').del();
  await db.table('regions_points').insert(regionsPoints);
  await db.table('regions_editors').del();
  await db.table('regions_editors').insert(regionsEditors);
}
