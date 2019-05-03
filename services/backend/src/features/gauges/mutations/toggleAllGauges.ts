import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { startJobs, stopJobs } from '@features/jobs';
import { SourceRaw } from '@features/sources';
import { HarvestMode } from '@whitewater-guide/commons';

interface Vars {
  sourceId: string;
  enabled: boolean;
  linkedOnly: boolean;
}

const toggleAllGauges: TopLevelResolver<Vars> = async (
  root,
  { sourceId, enabled, linkedOnly },
) => {
  const { harvest_mode }: Partial<SourceRaw> = await db()
    .table('sources')
    .select(['harvest_mode'])
    .where({ id: sourceId })
    .first();
  if (harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError('Not allowed on all-at-once sources');
  }
  let query = db()
    .table('gauges')
    .update({ enabled })
    .where({ source_id: sourceId, enabled: !enabled })
    .returning(['id', 'enabled']);
  if (enabled) {
    query = query.whereNotNull('cron');
  }
  if (linkedOnly) {
    query = query.whereExists((qb) =>
      qb
        .select(db().raw('1'))
        .from('sections')
        .whereRaw('sections.gauge_id = gauges.id'),
    );
  }
  const toggledGauges = await query;

  if (enabled) {
    await startJobs(sourceId);
  } else {
    await stopJobs(sourceId);
  }

  return toggledGauges;
};

export default toggleAllGauges;
