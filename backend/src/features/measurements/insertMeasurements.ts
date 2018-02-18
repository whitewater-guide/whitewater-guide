import db from '../../db';

interface Measurement {
  script: string;
  gauge_code: string;
  time: string;
  flow: number | null;
  level: number | null;
}

export default async function insertMeasurements(values: Measurement | Measurement[]) {
  const insert = db().table('measurements').insert(values).toQuery();
  await db().raw(`${insert} ON CONFLICT DO NOTHING`);
}
