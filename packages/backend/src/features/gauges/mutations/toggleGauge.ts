import { baseResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { startJobs, stopJobs } from '@features/jobs';
import { SourceRaw } from '@features/sources';
import { HarvestMode } from '@ww-commons';
import { GaugeRaw } from '../types';

interface Vars {
  id: string;
  enabled: boolean;
}

const resolver: TopLevelResolver<Vars> = async (root, { id, enabled }) => {
  const originalGauge: Partial<GaugeRaw> = await db().table('gauges')
    .select(['source_id', 'cron']).where({ id }).first();
  const source: Partial<SourceRaw> = await db().table('sources')
    .select(['harvest_mode']).where({ id: originalGauge.source_id }).first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    throw new MutationNotAllowedError({ message: 'Cannot toggle gauge for all-at-once sources' });
  }
  if (!originalGauge.cron) {
    throw new MutationNotAllowedError({ message: 'Cron must be set to enable gauge' });
  }
  const [updatedGauge] = await db().table('gauges')
    .update({ enabled }).where({ id }).returning(['id', 'enabled']);

  if (updatedGauge.enabled) {
    startJobs(originalGauge.source_id!, updatedGauge.id);
  } else {
    stopJobs(originalGauge.source_id!, updatedGauge.id);
  }

  return { ...updatedGauge };
};

const toggleGauge = baseResolver.createResolver(
  resolver,
);

export default toggleGauge;
