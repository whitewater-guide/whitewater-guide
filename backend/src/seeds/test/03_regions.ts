import { Point, Polygon } from 'wkx';
import { Coordinate3d } from '../../ww-commons';
import Knex = require('knex');

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

const regions = [
  {
    id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
    hidden: false,
    season_numeric: [20, 21],
    bounds: getBounds([[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]]),
  },
  {
    id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
    hidden: false,
    season_numeric: [],
    bounds: null,
  },
  {
    id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    hidden: true,
    season_numeric: [],
    bounds: null,
  },
];

const regionsEn = [
  {
    region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
    language: 'en',
    name: 'Galicia',
    description: 'Description of Galicia',
    season: 'Late autumn - early spring',
  },
  {
    region_id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
    language: 'en',
    name: 'Ecuador',
    description: null,
    season: null,
  },
  {
    region_id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    language: 'en',
    name: 'Norway',
    description: null,
    season: null,
  },
];

const regionsRu = [
  {
    region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
    language: 'ru',
    name: 'Галисия',
    description: 'описание Галисии',
    season: 'осень весна',
  },
];

const regionsPoints = [
  { region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f' },
  { region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', point_id: 'd7530317-efac-44a7-92ff-8d045b2ac893' },
];

export async function seed(db: Knex) {
  await db.table('regions').del();
  await db.table('regions_translations').del();
  await db.table('regions').insert(regions);
  await db.table('regions_translations').insert(regionsEn);
  await db.table('regions_translations').insert(regionsRu);
  await db.table('regions_points').del();
  await db.table('regions_points').insert(regionsPoints);
}
