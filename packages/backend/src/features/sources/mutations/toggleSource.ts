import { baseResolver, MutationNotAllowedError, TopLevelResolver } from '../../../apollo';
import db from '../../../db';
import { HarvestMode } from '../../../ww-commons';
import { startJobs, stopJobs } from '../../jobs';
import { SourceRaw } from '../types';

interface Vars {
  id: string;
  enabled: boolean;
}

const resolver: TopLevelResolver<Vars> = async (root, { id, enabled }) => {
  const source: Partial<SourceRaw> = await db().table('sources')
    .select(['id', 'harvest_mode', 'cron']).where({ id }).first();
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE && !source.cron) {
    throw new MutationNotAllowedError({ message: 'Cron must be set' });
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

const toggleSource = baseResolver.createResolver(
  resolver,
);

export default toggleSource;
