import { Job, scheduledJobs } from 'node-schedule';
import logger from './logger';

type Entry = [string, Job];

export function stopJobs(sourceId: string, gaugeId?: string) {
  const jobPrefix = gaugeId ? `${sourceId}:${gaugeId}` : sourceId;
  logger.info(`Stopping jobs: ${jobPrefix}`);
  Object.entries(scheduledJobs).forEach(([jobId, job]: Entry) => {
    if (jobId.startsWith(jobPrefix)) {
      job.cancel();
      logger.info(`Stopped job: ${jobId}`);
    }
  });
}
