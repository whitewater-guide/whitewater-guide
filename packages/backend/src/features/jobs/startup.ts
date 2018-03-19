import db from '../../db';
import { SourceRaw } from '../sources';
import logger from './logger';
import { startJobs } from './startJobs';

export const startupJobs = async () => {
  logger.info('Staring jobs on app start');
  const enabledSources: Array<Partial<SourceRaw>> = await db().table('sources').select(['id']).where({ enabled: true });
  await Promise.all(enabledSources.map(src => startJobs(src.id!)));
  logger.info('Jobs startup complete');
};
