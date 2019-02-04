import { GaugeRaw } from '@features/gauges';
import Knex from 'knex';

export const getRiverzoneGaugeIds = async (
  db: Knex,
): Promise<Map<string, string>> => {
  const gauges: GaugeRaw[] = await db
    .table('gauges')
    .innerJoin('sources', 'gauges.source_id', '=', 'sources.id')
    .select('gauges.id', 'gauges.code')
    .where('sources.script', 'riverzone');
  return new Map(gauges.map(({ id, code }) => [code, id] as [string, string]));
};
