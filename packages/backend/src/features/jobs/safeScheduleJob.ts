import {
  Job,
  JobCallback,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
  scheduledJobs,
  scheduleJob,
} from 'node-schedule';

type Rule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string;

const safeScheduleJob = (name: string, rule: Rule, callback: JobCallback): Job =>
  scheduledJobs[name] || scheduleJob(name, rule, callback);

export default safeScheduleJob;
