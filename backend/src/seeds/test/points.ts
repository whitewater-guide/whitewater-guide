import { Point as WKXPoint } from 'wkx';
import { Coordinate3d } from '../../ww-commons/';
import Knex = require('knex');

function getCoordinates(coordinates: Coordinate3d): string {
  const wkxPoint = new WKXPoint(...coordinates);
  wkxPoint.srid = 4326;
  return wkxPoint.toEwkt();
}

const points = [
  {
    id: '573f995a-d55f-4faf-8f11-5a6016ab562f',
    coordinates: getCoordinates([20, 30, 40]),
    kind: 'kayak-shop',
  },
  {
    id: 'd7530317-efac-44a7-92ff-8d045b2ac893',
    coordinates: getCoordinates([11, 22, 33]),
    kind: 'other',
  },
];

const pointsEn = [
  {
    point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f',
    language: 'en',
    name: 'Region 1 Point 1',
    description: 'r1p1 description',
  },
  {
    point_id: 'd7530317-efac-44a7-92ff-8d045b2ac893',
    language: 'en',
    name: 'Region 1 Point 2',
    description: 'r1p2 description',
  },
];

const pointsRu = [
  {
    point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f',
    language: 'ru',
    name: 'Регион 1 точка 1',
    description: 'р1т1 описание',
  },
];

export async function seed(db: Knex) {
  await db.table('points').del();
  await db.table('points_translations').del();
  await db.table('points').insert(points);
  await db.table('points_translations').insert(pointsEn);
  await db.table('points_translations').insert(pointsRu);
}
