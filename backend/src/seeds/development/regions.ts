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
  },
  {
    id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
    name: 'Empty region',
  },
  {
    id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    name: 'Hidden region',
    hidden: true,
  },
];

export async function seed(db: Knex) {
  await db.table('regions').del();
  await db.table('regions').insert(regions.map(toRaw));
}
