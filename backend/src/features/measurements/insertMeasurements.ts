import db from '../../db';
import { WorkerMeasurement } from './types';

export async function insertMeasurements(values: WorkerMeasurement[]) {
  const insert = db().table('measurements').insert(values).toQuery();
  await db().raw(`${insert} ON CONFLICT DO NOTHING`);
}
