import { Job } from 'meteor/vsivsi:job-collection';
import { Sources } from '../../sources';
import { Jobs } from '../index';
import { Measurements } from '../../measurements';
import { Gauges } from '../../gauges';
import { Meteor } from 'meteor/meteor';
import { after } from 'lodash';
import moment from 'moment';
import path from 'path';
import child_process from 'child_process';


const cleanupJob = new Job(Jobs, 'cleanup', {})
  .repeat({ schedule: Jobs.later.parse.text("every 5 minutes") })
  .save({ cancelRepeats: true });

const cleanupQueue = Jobs.processJobs('cleanup', { pollInterval: false, workTimeout: 60 * 1000 }, (job, callback) => {
  const current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  const ids = Jobs.find(
    {
      status: { $in: Job.jobStatusRemovable },
      updated: { $lt: current },
    },
    { fields: { _id: 1 } }
  ).map(d => d._id);

  if (ids.length > 0) {
    Jobs.removeJobs(ids);
  }
  job.done(`Removed ${ids.length} old jobs`);
  callback();
});

Jobs.find({ status: 'ready' })
  .observe({ added: function () { cleanupQueue.trigger(); } });

//Remove all jobs at startup.
stopJobs();
//Create new jobs
Sources.find({}).forEach(sourceDoc => {
  startJobs(sourceDoc._id);
});

Jobs.processJobs('harvest', {}, (job, callback) => {
  const launchScriptFiber = Meteor.wrapAsync(worker);
  try {
    const measurements = launchScriptFiber(job.data);
    let insertCount = 0;
    const finishJob = after(measurements.length, () => job.done({measurements: insertCount}));
    measurements.forEach(measurement => {
      const gaugeId = job.data.gaugeId ? job.data.gaugeId : Gauges.findOne({ sourceId: job.data.sourceId, code: measurement.code })._id;
      if (measurement.value) {
        Measurements.insert({
          gaugeId: gaugeId,
          date: new Date(measurement.timestamp),
          value: measurement.value,
        }, (err) => {
          if (err)
            console.log(`Error while inserting measurement into ${gaugeId}: ${err}`);
          else
            insertCount++;
          finishJob();
        });
      }
    });
  }
  catch (ex) {
    console.log(`Harvest job exception for ${job.data.script}: ${JSON.stringify(ex)}`);
    job.fail(ex);
  }
  callback();
});

Jobs.startJobServer();
// Jobs.setLogStream(process.stdout);

function worker({script, gaugeId}, nodeCallback) {
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  //It is possible to check gauge's last timestamp here and pass it to worker
  const gaugeDoc = gaugeId && Gauges.findOne(gaugeId);
  const args = ['harvest'];
  if (gaugeDoc) {
    args.push(gaugeDoc.code);
    if (gaugeDoc.lastTimestamp)
      args.push(gaugeDoc.lastTimestamp);
  }
  console.log(`Launching worker ${script} with args ${args}`);
  const child = child_process.fork(file, args);
  let response;

  child.on('close', (code) => {
    if (code === 0) {
      nodeCallback(undefined, response);
    }
    else {
      nodeCallback(response);
    }
  });

  child.on('message', (data) => {
    response = data;
  });
}

export function stopJobs(sourceId, gaugeId) {
  console.log('Stopping jobs', sourceId, gaugeId);
  let selector = { type: 'harvest' };
  if (sourceId)
    selector = {...selector, "data.sourceId": sourceId };
  if (gaugeId)
    selector = {...selector, "data.gaugeId": gaugeId };
  const cancellableJobs = Jobs.find({...selector, status: { $in: Job.jobStatusCancellable } })
    .fetch().map(j => j._id);
  Jobs.cancelJobs(cancellableJobs);
  const removableJobs = Jobs.find({ ...selector, status: { $in: Job.jobStatusRemovable } })
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
    Sources.update(sourceId, { $set: { cron: '0 * * * *' } });
  }
  else if (source.harvestMode === 'oneByOne') {
    const gauges = source.gauges().fetch();
    const numGauges = gauges.length;
    if (numGauges === 0)
      return;
    const step = 60 / numGauges;
    for (let i = 0; i < numGauges; i++) {
      const minute = Math.ceil(i * step);
      const cron = `${minute} * * * *`;
      const gauge = gauges[i];
      Gauges.update(gauge._id, { $set: { cron } });
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
    job.repeat({ schedule: Jobs.later.parse.cron(source.cron) });
    job.save();
  }
  else if (source.harvestMode === 'oneByOne') {
    const gauges = gaugeId === undefined ? source.gauges() : [Gauges.findOne(gaugeId)];
    gauges.forEach(gauge => {
      if (gauge.enabled && gauge.cron) {
        const job = new Job(Jobs, 'harvest', {
          script: source.script,
          sourceId: source._id,
          gaugeId: gauge._id,
        });
        console.log(`Add job for gauge ${gauge.name} at ${gauge.cron}`);
        job
          .repeat({ schedule: Jobs.later.parse.cron(gauge.cron) })
          .retry({ wait: 60 * 60 * 1000 })
          .save();
      }
    });
  }
}