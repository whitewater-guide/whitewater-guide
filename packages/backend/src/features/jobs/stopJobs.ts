import { Job, scheduledJobs } from 'node-schedule';

type Entry = [string, Job];

export function stopJobs(sourceId: string, gaugeId?: string) {
  const jobPrefix = gaugeId ? `${sourceId}:${gaugeId}` : sourceId;
  Object.entries(scheduledJobs).forEach(([jobId, job]: Entry) => {
    if (jobId.startsWith(jobPrefix)) {
      job.cancel();
    }
  });
}
