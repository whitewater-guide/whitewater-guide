import db, { holdTransaction, rollbackTransaction } from '../../db';
import insertMeasurements from './insertMeasurements';

let measurementsBefore: number;

beforeAll(async () => {
  const { count } = await db(true).table('measurements').count().first();
  measurementsBefore = Number(count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

it('should insert', async () => {
  await insertMeasurements({
    script: 'galicia',
    gauge_code: 'gal1',
    time: '2018-01-01 04:00:00',
    flow: 23,
    level: 33,
  });
  const { count } = await db().table('measurements').count().first();
  expect(Number(count) - measurementsBefore).toBe(1);
});

it('should not let insert values that already exist', async () => {
  await insertMeasurements({
    script: 'galicia',
    gauge_code: 'gal1',
    time: '2018-01-01 01:00:00',
    flow: 22,
    level: 22,
  });
  const { count } = await db().table('measurements').count().first();
  expect(Number(count)).toBe(measurementsBefore);
});

it('should not let insert dupes', async () => {
  await insertMeasurements([
    { script: 'galicia', gauge_code: 'gal1', time: '2018-01-01 05:00:00', flow: 22, level: 22 },
    { script: 'galicia', gauge_code: 'gal1', time: '2018-01-01 05:00:00', flow: 44, level: 44 },
  ]);
  const { count } = await db().table('measurements').count().first();
  expect(Number(count) - measurementsBefore).toBe(1);
});
