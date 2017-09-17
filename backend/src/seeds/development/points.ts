import { toRaw } from '../../features/points';
import { PointInput } from '../../ww-commons';
import Knex = require('knex');

const points: PointInput[] = [
  {
    id: '573f995a-d55f-4faf-8f11-5a6016ab562f',
    coordinates: [20, 30, 40],
    name: 'Region 1 Point 1',
    description: 'r1p1 description',
    kind: 'kayak-shop',
  },
  {
    id: 'd7530317-efac-44a7-92ff-8d045b2ac893',
    coordinates: [11, 22, 33],
    name: 'Region 1 Point 2',
    description: 'r1p2 description',
    kind: 'other',
  },
];

export async function seed(db: Knex) {
  await db.table('points').del();
  await db.table('points').insert(points.map(toRaw));
}
