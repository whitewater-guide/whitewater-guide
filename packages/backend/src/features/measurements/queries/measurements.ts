import type { QueryResolvers } from '../../../apollo/index';
import { UnknownError, UserInputError } from '../../../apollo/index';
import { db } from '../../../db/index';

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

function query(
  gaugeId?: string | null,
  sectionId?: string | null,
): Promise<any> {
  if (!gaugeId && !sectionId) {
    throw new UserInputError('Either gauge id or section id must be specified');
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return gaugeId ? gaugeQuery(gaugeId) : sectionQuery(sectionId!);
}

const measurementsResolver: QueryResolvers['measurements'] = async (
  _,
  { gaugeId, sectionId, days, filter },
  { dataSources },
) => {
  let effectiveFilter = filter;
  if (!days && !filter) {
    const from = new Date();
    from.setTime(from.getTime() - 7 * 24 * 60 * 60 * 1000);
    effectiveFilter = { from };
  }
  if (days && !filter) {
    const from = new Date();
    from.setTime(from.getTime() - days * 24 * 60 * 60 * 1000);
    effectiveFilter = { from };
  }
  const gauge = await query(gaugeId, sectionId);
  if (!gauge) {
    throw new UnknownError('gauge not found');
  }
  const { script, code } = gauge;
  const result = await dataSources.gorge.getMeasurements(
    script,
    code,
    effectiveFilter!,
  );
  return result;
};

export default measurementsResolver;
