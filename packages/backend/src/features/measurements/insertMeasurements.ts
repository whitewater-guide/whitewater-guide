import db from '../../db';
import { ScriptMeasurement } from '../scripts';
import logger from './logger';

export async function insertMeasurements(values: ScriptMeasurement[]) {
  if (values.length === 0) {
    logger.warn('attempt to insert 0 values');
    return;
  }
  const insert = db().table('measurements').insert(values).toQuery();
  await db().raw(`${insert} ON CONFLICT DO NOTHING`);
}
