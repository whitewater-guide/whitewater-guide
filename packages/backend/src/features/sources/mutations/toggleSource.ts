import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import { startJobs, stopJobs } from '@features/jobs';
import { HarvestMode } from '@ww-commons';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
  enabled: boolean;
}

const toggleSource: TopLevelResolver<Vars> = async (root, { id, enabled }) => {
  const source: Partial<SourceRaw> = await db().table('sources')
    .select(['id', 'harvest_mode', 'cron']).where({ id }).first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE && !source.cron) {
    throw new MutationNotAllowedError('Cron must be set');
  }
  const [updatedSource]: Array<Partial<SourceRaw>> = await db().table('sources')
    .update({ enabled }).where({ id }).returning(['id', 'enabled']);
  if (updatedSource.enabled) {
    await startJobs(updatedSource.id!);
  } else {
    await stopJobs(updatedSource.id!);
  }
  return { ...updatedSource };
};

export default toggleSource;
