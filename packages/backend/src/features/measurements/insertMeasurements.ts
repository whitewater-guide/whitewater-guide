import db from '../../db';
import { ScriptMeasurement } from '../scripts';

export async function insertMeasurements(values: ScriptMeasurement[]) {
  const insert = db().table('measurements').insert(values).toQuery();
  await db().raw(`${insert} ON CONFLICT DO NOTHING`);
}
