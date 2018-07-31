import { TopLevelResolver } from '@apollo';
import db from '@db';
import { UserInputError } from 'apollo-server';
import { QueryBuilder } from 'knex';
import { clamp } from 'lodash';

interface Vars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

const gaugeQueryBuilder = (gaugeId: string) => (qb: QueryBuilder) =>
  qb.table('gauges')
    .select(['script', 'code'])
    .innerJoin('sources', 'gauges.source_id', 'sources.id')
    .where('gauges.id', gaugeId)
    .limit(1);

const sectionQueryBuilder = (sectionId: string) => (qb: QueryBuilder) =>
  qb.table('sections')
    .select(['script', 'code'])
    .innerJoin('gauges', 'sections.gauge_id', 'gauges.id')
    .innerJoin('sources', 'gauges.source_id', 'sources.id')
    .where('sections.id', sectionId!)
    .limit(1);

export const cteBuilder = (gaugeId?: string, sectionId?: string) => {
    if (!gaugeId && !sectionId) {
      throw new UserInputError('Either gauge id or section id must be specified');
    }
    return gaugeId ? gaugeQueryBuilder(gaugeId) : sectionQueryBuilder(sectionId!);
};

const lastMeasurementsResolver: TopLevelResolver<Vars> = async (root, { gaugeId, sectionId, days }) => {
  const dayz = clamp(days, 1, 31);
  return db()
    .with('key',  cteBuilder(gaugeId, sectionId))
    .select('*')
    .from('measurements')
    .joinRaw('NATURAL JOIN key')
    .whereRaw(`timestamp > NOW() - interval '${dayz} days'`)
    .orderBy('timestamp', 'DESC');
};

export default lastMeasurementsResolver;
