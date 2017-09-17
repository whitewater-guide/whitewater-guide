import { toRaw } from '../../features/regions';
import { RegionInput } from '../../ww-commons';
import Knex = require('knex');

const regions: RegionInput[] = [
  {
    id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
    name: 'Galicia',
    description: 'Description of Galicia',
    hidden: false,
    season: 'Late autumn - early spring',
    seasonNumeric: [20, 21],
    bounds: [[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]],
    pois: [],
  },
  {
    id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
    name: 'Empty region',
    description: null,
    hidden: false,
    season: null,
    seasonNumeric: [],
    bounds: [],
    pois: [],
  },
  {
    id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    name: 'Hidden region',
    description: null,
    hidden: true,
    season: null,
    seasonNumeric: [],
    bounds: [],
    pois: [],
  },
];

const regionsPoints = [
  { region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f' },
  { region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', point_id: 'd7530317-efac-44a7-92ff-8d045b2ac893' },
];

export async function seed(db: Knex) {
  await db.table('regions').del();
  await db.table('regions').insert(regions.map(toRaw));
  await db.table('points_regions').del();
  await db.table('points_regions').insert(regionsPoints);
}
