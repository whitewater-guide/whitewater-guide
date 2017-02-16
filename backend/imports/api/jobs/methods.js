import {Jobs} from './collection';
import {Sources} from '../sources';
import {Gauges} from '../gauges';
import {Job} from 'meteor/vsivsi:job-collection';

export function stopJobs(sourceId, gaugeId) {
  console.log('Stopping jobs', sourceId, gaugeId);
  let selector = {type: 'harvest'};
  if (sourceId)
    selector = {...selector, "data.sourceId": sourceId};
  if (gaugeId)
    selector = {...selector, "data.gaugeId": gaugeId};
  const cancellableJobs = Jobs.find({...selector, status: {$in: Job.jobStatusCancellable}})
    .fetch().map(j => j._id);
  Jobs.cancelJobs(cancellableJobs);
  const removableJobs = Jobs.find({...selector, status: {$in: Job.jobStatusRemovable}})
    .fetch().map(j => j._id);
  Jobs.removeJobs(removableJobs);
}

/**
 * Generate cron and save it to source/gauges
 */
export function generateSchedule(sourceId) {
  const source = Sources.findOne(sourceId);
  if (!source)
    return;

  if (source.harvestMode === 'allAtOnce') {
    Sources.update(sourceId, {$set: {cron: '0 * * * *'}});
  }
  else if (source.harvestMode === 'oneByOne') {
    const gauges = Gauges.find({sourceId}).fetch();
    const numGauges = gauges.length;
    if (numGauges === 0)
      return;
    const step = 59 / numGauges;
    for (let i = 0; i < numGauges; i++) {
      const minute = Math.ceil(i * step);
      const cron = `${minute} * * * *`;
      const gauge = gauges[i];
      Gauges.update(gauge._id, {$set: {cron}});
    }
  }
}

/**
 * Generate jobs for sources/gauges with proper cron values
 */
export function startJobs(sourceId, gaugeId) {
  console.log('Starting jobs', sourceId, gaugeId);
  const source = Sources.findOne(sourceId);
  if (!source || !source.enabled)
    return;

  //Remove all running jobs
  stopJobs(sourceId, gaugeId);

  if (source.harvestMode === 'allAtOnce' && source.cron) {
    const job = new Job(Jobs, 'harvest', {
      script: source.script,
      sourceId: source._id,
    });
    job.repeat({schedule: Jobs.later.parse.cron(source.cron)});
    job.save();
  }
  else if (source.harvestMode === 'oneByOne') {
    const gauges = gaugeId === undefined ? Gauges.find({sourceId}).fetch() : [Gauges.findOne(gaugeId)];
    gauges.forEach(gauge => {
      if (gauge.enabled && gauge.cron) {
        const job = new Job(Jobs, 'harvest', {
          script: source.script,
          sourceId: source._id,
          gaugeId: gauge._id,
        });
        console.log(`Add job for gauge ${gauge.name} at ${gauge.cron}`);
        job
          .repeat({schedule: Jobs.later.parse.cron(gauge.cron)})
          .retry({retries: Job.forever, wait: 60 * 60 * 1000})
          .save();
      }
    });
  }
}