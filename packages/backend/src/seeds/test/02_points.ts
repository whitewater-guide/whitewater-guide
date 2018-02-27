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
  {
    id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a', // gauge gal1
    coordinates: getCoordinates([1.1, 2.2, 3.3]),
    kind: 'gauge',
  },
  {
    id: 'ca0bee06-d445-11e7-9296-cec278b6b50a', // Galicia River 1 Section 1
    coordinates: getCoordinates([1.2, 3.2, 4.3]),
    kind: 'rapid',
  },
  {
    id: 'ef6f80ea-d445-11e7-9296-cec278b6b50a', // Galicia River 1 Section 1
    coordinates: getCoordinates([5, 6, 7]),
    kind: 'portage',
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
  {
    point_id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Galicia Riv 1 Sec 1 Rapid',
    description: 'Some rapid',
  },
  {
    point_id: 'ef6f80ea-d445-11e7-9296-cec278b6b50a',
    language: 'en',
    name: 'Galicia Riv 1 Sec 1 Portage',
    description: 'Some portage',
  },
];

const pointsRu = [
  {
    point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f',
    language: 'ru',
    name: 'Регион 1 точка 1',
    description: 'р1т1 описание',
  },
  {
    point_id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
    language: 'ru',
    name: 'Галисия Река 1 Секция 1 Порог',
    description: 'Какой-то порог',
  },
];

export async function seed(db: Knex) {
  await db.table('points').del();
  await db.table('points_translations').del();
  await db.table('points').insert(points);
  await db.table('points_translations').insert(pointsEn);
  await db.table('points_translations').insert(pointsRu);
}