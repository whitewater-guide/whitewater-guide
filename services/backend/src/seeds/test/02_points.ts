import { Coordinate3d } from '@whitewater-guide/commons';
import Knex from 'knex';
import { Point as WKXPoint } from 'wkx';

function getCoordinates(coordinates: Coordinate3d): string {
  const wkxPoint = new WKXPoint(...coordinates);
  wkxPoint.srid = 4326;
  return wkxPoint.toEwkt();
}

export const GALICIA_PT_1 = '573f995a-d55f-4faf-8f11-5a6016ab562f';
export const GALICIA_PT_2 = 'd7530317-efac-44a7-92ff-8d045b2ac893';
export const LOWER_BECA_PT_1 = 'ca0bee06-d445-11e7-9296-cec278b6b50a';
export const LOWER_BECA_PT_2 = 'ef6f80ea-d445-11e7-9296-cec278b6b50a';
export const LAOS_PT_1 = 'a52dfcc6-3716-11e8-b467-0ed5f89f718b';
export const RUSSIA_MZYMTA_PASEKA_PT_1 = '47cf3103-4120-402b-b714-9319ac092dbe';

const points = [
  {
    id: GALICIA_PT_1,
    coordinates: getCoordinates([20, 30, 40]),
    kind: 'kayak-shop',
    default_lang: 'en',
  },
  {
    id: GALICIA_PT_2,
    coordinates: getCoordinates([11, 22, 33]),
    kind: 'other',
    default_lang: 'en',
  },
  {
    id: LAOS_PT_1,
    coordinates: getCoordinates([4, 3, 343]),
    kind: 'other',
    default_lang: 'en',
  },
  {
    id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a', // gauge gal1
    coordinates: getCoordinates([1.1, 2.2, 3.3]),
    kind: 'gauge',
    default_lang: 'en',
  },
  {
    id: LOWER_BECA_PT_1,
    coordinates: getCoordinates([1.2, 3.2, 4.3]),
    kind: 'rapid',
    default_lang: 'en',
  },
  {
    id: LOWER_BECA_PT_2,
    coordinates: getCoordinates([5, 6, 7]),
    kind: 'portage',
    default_lang: 'en',
  },
  {
    id: RUSSIA_MZYMTA_PASEKA_PT_1,
    coordinates: getCoordinates([8, 9, 10]),
    kind: 'portage',
    default_lang: 'ru',
  },
];

const pointsEn = [
  {
    point_id: GALICIA_PT_1,
    language: 'en',
    name: 'Galicia Point 1',
    description: 'Galicia Point 1 description',
  },
  {
    point_id: GALICIA_PT_2,
    language: 'en',
    name: 'Galicia Point 2',
    description: 'Galicia Point 2 description',
  },
  {
    point_id: LAOS_PT_1,
    language: 'en',
    name: 'Laos Point 1',
    description: 'Laos point 1 description',
  },
  {
    point_id: LOWER_BECA_PT_1,
    language: 'en',
    name: 'Lower Beca Rapid',
    description: 'Some rapid',
  },
  {
    point_id: LOWER_BECA_PT_2,
    language: 'en',
    name: 'Lower Beca Portage',
    description: 'Some portage',
  },
];

const pointsRu = [
  {
    point_id: GALICIA_PT_1,
    language: 'ru',
    name: 'Регион 1 точка 1',
    description: 'р1т1 описание',
  },
  {
    point_id: LOWER_BECA_PT_1,
    language: 'ru',
    name: 'Нижняя Беса Порог',
    description: 'Какой-то порог',
  },
  {
    point_id: RUSSIA_MZYMTA_PASEKA_PT_1,
    language: 'ru',
    name: 'Обнос прорыва',
    description: 'По правому берегу',
  },
];

export async function seed(db: Knex) {
  await db.table('points').del();
  await db.table('points_translations').del();
  await db.table('points').insert(points);
  await db.table('points_translations').insert(pointsEn);
  await db.table('points_translations').insert(pointsRu);
}
