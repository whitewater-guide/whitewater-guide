import db, { holdTransaction, rollbackTransaction } from '../../db';
import { insertMeasurements } from './insertMeasurements';

let measurementsBefore: number;

beforeAll(async () => {
  const { count } = await db(true).table('measurements').count().first();
  measurementsBefore = Number(count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

it('should insert', async () => {
  await insertMeasurements([{
    script: 'galicia',
    code: 'gal1',
    timestamp: '2018-01-01T04:00Z',
    flow: 23,
    level: 33,
  }]);
  const { count } = await db().table('measurements').count().first();
  expect(Number(count) - measurementsBefore).toBe(1);
});

it('should not let insert values that already exist', async () => {
  await insertMeasurements([{
    script: 'galicia',
    code: 'gal1',
    timestamp: '2018-01-01T01:00Z',
    flow: 22,
    level: 22,
  }]);
  const { count } = await db().table('measurements').count().first();
  expect(Number(count)).toBe(measurementsBefore);
});

it('should not let insert dupes', async () => {
  await insertMeasurements([
    { script: 'galicia', code: 'gal1', timestamp: '2018-01-01T05:00Z', flow: 22, level: 22 },
    { script: 'galicia', code: 'gal1', timestamp: '2018-01-01T05:00Z', flow: 44, level: 44 },
  ]);
  const { count } = await db().table('measurements').count().first();
  expect(Number(count) - measurementsBefore).toBe(1);
});
