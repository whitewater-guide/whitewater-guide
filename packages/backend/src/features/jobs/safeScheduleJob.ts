import {
  Job,
  JobCallback,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
  scheduledJobs,
  scheduleJob,
} from 'node-schedule';
import logger from './logger';

type Rule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string;

const safeScheduleJob = (name: string, rule: Rule, callback: JobCallback): Job => {
  if (scheduledJobs[name]) {
    return scheduledJobs[name];
  }
  const job = scheduleJob(name, rule, callback);
  logger.info(`Scheduled job ${name}`);
  return job;
};

export default safeScheduleJob;
