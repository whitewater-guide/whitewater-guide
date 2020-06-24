import { TopLevelResolver, UnknownError } from '~/apollo';
import db from '~/db';
import { UserInputError } from 'apollo-server';

interface Vars {
  gaugeId?: string;
  sectionId?: string;
  days: number;
}

const gaugeQuery = (gaugeId: string) =>
  db()
    .table('gauges')
    .select(['script', 'code'])
    .innerJoin('sources', 'gauges.source_id', 'sources.id')
    .where('gauges.id', gaugeId)
    .first();

const sectionQuery = (sectionId: string) =>
  db()
    .table('sections')
    .select(['script', 'code'])
    .innerJoin('gauges', 'sections.gauge_id', 'gauges.id')
    .innerJoin('sources', 'gauges.source_id', 'sources.id')
    .where('sections.id', sectionId)
    .first();

export const query = (gaugeId?: string, sectionId?: string) => {
  if (!gaugeId && !sectionId) {
    throw new UserInputError('Either gauge id or section id must be specified');
  }
  return gaugeId ? gaugeQuery(gaugeId) : sectionQuery(sectionId!);
};

const measurementsResolver: TopLevelResolver<Vars> = async (
  _,
  { gaugeId, sectionId, days },
  { dataSources },
) => {
  const gauge = await query(gaugeId, sectionId);
  if (!gauge) {
    throw new UnknownError('gauge not found');
  }
  const { script, code } = gauge;
  const result = await dataSources.gorge.getMeasurements(script, code, days);
  return result;
};

export default measurementsResolver;
