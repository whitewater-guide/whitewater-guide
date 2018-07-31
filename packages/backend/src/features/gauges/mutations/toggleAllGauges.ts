import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { startJobs, stopJobs } from '@features/jobs';
import { SourceRaw } from '@features/sources';
import { HarvestMode } from '@ww-commons';

interface Vars {
  sourceId: string;
  enabled: boolean;
}

const toggleAllGauges: TopLevelResolver<Vars> = async (root, { sourceId, enabled }) => {
  const { harvest_mode }: Partial<SourceRaw> = await db().table('sources')
    .select(['harvest_mode']).where({ id: sourceId }).first();
  if (harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError('Not allowed on all-at-once sources');
  }
  let query = db().table('gauges')
    .update({ enabled })
    .where({ source_id: sourceId, enabled: !enabled })
    .returning(['id', 'enabled']);
  if (enabled) {
    query = query.whereNotNull('cron');
  }
  const toggledGauges = await query;

  // TODO: should be in transaction
  if (enabled) {
    await startJobs(sourceId);
  } else {
    await stopJobs(sourceId);
  }

  return toggledGauges.map((gauge: any) => ({ ...gauge }));
};

export default toggleAllGauges;
