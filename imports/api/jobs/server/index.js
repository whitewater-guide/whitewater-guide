import { Job } from 'meteor/vsivsi:job-collection';
import { Sources } from '../../sources';
import { Jobs } from '../index';
import { Measurements } from '../../measurements';
import { Gauges } from '../../gauges';
import { Meteor } from 'meteor/meteor';
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
    console.log(`Removed ${ids.length} old jobs`);
  }
  job.done(`Removed ${ids.length} old jobs`);
  callback();
});

Jobs.find({status: 'ready'})
  .observe({ added: function () { cleanupQueue.trigger(); } });

Jobs.processJobs('harvest', {}, (job, callback) => {
  const launchScriptFiber = Meteor.wrapAsync(worker);
  try {
    const measurements = launchScriptFiber(job.data.script);
    measurements.forEach(measurement => {
      const gauge = Gauges.findOne({ code: measurement.code })
      console.log('Measurement:', JSON.stringify(measurement), JSON.stringify(gauge));
      Measurements.insert({
        gauge: gauge._id,
        date: new Date(measurement.timestamp),
        value: measurement.value,
      });
    });
    job.done();
  }
  catch (ex) {
    console.log(`Harvest job exception for ${job.data.script}`);
    job.fail(ex);
  }
  callback();
});

Jobs.startJobServer();
Jobs.setLogStream(process.stdout);

function worker(script, nodeCallback) {
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  const child = child_process.fork(file, ['harvest']);
  let response;
  
  child.on('close', (code) => {
      if (code === 0){
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

export function generateSchedule(sourceId) {
  console.log(`Generating schedule for ${sourceId}`);
  const source = Sources.findOne(sourceId);
  if (!source)
    return;
  if (source.harvestMode === 'allAtOnce') {
    const job = new Job(Jobs, 'harvest', {
      script: source.script,
      source: source._id,
    });
    job.repeat({ schedule: Jobs.later.parse.text(`every ${source.interval} mins`) });
    job.save();
  }
}