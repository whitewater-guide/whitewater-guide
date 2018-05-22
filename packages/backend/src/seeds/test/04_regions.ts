import Knex from 'knex';
import { Point, Polygon } from 'wkx';
import { Coordinate3d } from '../../ww-commons';
import { EDITOR_GA_EC_ID, EDITOR_GE_ID, EDITOR_NO_EC_ID, EDITOR_NO_ID } from './01_users';
import { ECUADOR_PT_1, GALICIA_PT_1, GALICIA_PT_2 } from './02_points';
import { GROUP_ALL, GROUP_EU, GROUP_EU_CIS, GROUP_LATIN } from './03_groups';

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

export const NUM_REGIONS = 5;

export const REGION_GALICIA = 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34';
export const REGION_ECUADOR = '2caf75ca-7625-11e7-b5a5-be2e44b06b34';
export const REGION_NORWAY = 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34';
export const REGION_GEORGIA = '8e119768-37f3-11e8-b467-0ed5f89f718b';
export const REGION_LAOS = 'a84d7eda-37f3-11e8-b467-0ed5f89f718b';

const regions = [
  {
    id: REGION_GALICIA,
    hidden: false,
    premium: false,
    sku: null,
    season_numeric: [20, 21],
    bounds: getBounds([[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]]),
  },
  {
    id: REGION_ECUADOR,
    hidden: false,
    premium: true,
    sku: 'region.ecuador',
    season_numeric: [],
    bounds: null,
  },
  {
    id: REGION_NORWAY,
    hidden: true,
    premium: true,
    sku: 'region.norway',
    season_numeric: [],
    bounds: null,
  },
  {
    id: REGION_GEORGIA,
    hidden: false,
    premium: true,
    sku: 'region.georgia',
    season_numeric: [11, 12],
    bounds: getBounds([[43.51, 39.97, 0], [41.93, 46.39, 0], [41.05, 46.52, 0], [41.51, 41.58, 0]]),
  },
  {
    id: REGION_LAOS,
    hidden: true,
    premium: false,
    sku: null,
    season_numeric: [3, 4, 5, 6],
    bounds: getBounds([[20.72, 99.62, 0], [14.2, 105.42, 0], [15.05, 108.10, 0], [22.66, 102.5, 0]]),
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
  {
    region_id: REGION_GEORGIA,
    language: 'en',
    name: 'Georgia',
    description: 'description of Georgia',
    season: 'spring, summer, autumn',
  },
  {
    region_id: REGION_LAOS,
    language: 'en',
    name: 'Laos',
    description: 'laos description',
    season: 'laos season',
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
  {
    region_id: REGION_GEORGIA,
    language: 'ru',
    name: 'Грузия',
    description: 'описание Грузии',
    season: 'осень лето весна',
  },
];

const regionsPoints = [
  { region_id: REGION_GALICIA, point_id: GALICIA_PT_1 },
  { region_id: REGION_GALICIA, point_id: GALICIA_PT_2 },
  { region_id: REGION_ECUADOR, point_id: ECUADOR_PT_1 },
];

const regionsEditors = [
  { region_id: REGION_GALICIA, user_id: EDITOR_GA_EC_ID },
  { region_id: REGION_ECUADOR, user_id: EDITOR_GA_EC_ID },
  { region_id: REGION_ECUADOR, user_id: EDITOR_NO_EC_ID },
  { region_id: REGION_NORWAY, user_id: EDITOR_NO_EC_ID },
  { region_id: REGION_NORWAY, user_id: EDITOR_NO_ID },
  { region_id: REGION_GEORGIA, user_id: EDITOR_GE_ID },
];

const regionsGroups = [
  { region_id: REGION_GALICIA, group_id: GROUP_EU },
  { region_id: REGION_GALICIA, group_id: GROUP_EU_CIS },
  { region_id: REGION_NORWAY, group_id: GROUP_EU },
  { region_id: REGION_NORWAY, group_id: GROUP_EU_CIS },
  { region_id: REGION_GEORGIA, group_id: GROUP_EU_CIS },
  { region_id: REGION_ECUADOR, group_id: GROUP_LATIN },

  { region_id: REGION_GALICIA, group_id: GROUP_ALL },
  { region_id: REGION_ECUADOR, group_id: GROUP_ALL },
  { region_id: REGION_NORWAY, group_id: GROUP_ALL },
  { region_id: REGION_GEORGIA, group_id: GROUP_ALL },
  { region_id: REGION_LAOS, group_id: GROUP_ALL },
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
  await db.table('regions_groups').del();
  await db.table('regions_groups').insert(regionsGroups);
}
