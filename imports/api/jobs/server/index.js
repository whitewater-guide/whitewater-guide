import { JobCollection, Job } from 'meteor/vsivsi:job-collection';
import { Sources } from '../../sources';
import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const allJobs = JobCollection('sources');

const cleanupJob = new Job(allJobs, 'cleanup', {})
  .repeat({ schedule: allJobs.later.parse.text("every 5 minutes") })
  .save({ cancelRepeats: true });

const cleanupQueue = allJobs.processJobs('cleanup', { pollInterval: false, workTimeout: 60 * 1000 }, (job, callback) => {
  const current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  const ids = allJobs.find(
    {
      status: { $in: Job.jobStatusRemovable },
      updated: { $lt: current },
    },
    { fields: { _id: 1 } }
  ).map(d => d._id);

  if (ids.length > 0) {
    allJobs.removeJobs(ids);
    console.log(`Removed ${ids.length} old jobs`);
  }
  job.done(`Removed ${ids.length} old jobs`);
  callback();
});

allJobs.find({status: 'ready'})
  .observe({ added: function () { cleanupQueue.trigger(); } });

allJobs.processJobs('harvest', {}, (job, callback) => {
  const launchScriptFiber = Meteor.wrapAsync(worker);
  try {
    const measurements = launchScriptFiber(job.data.script);
    console.log(`Job result: ${measurements}`);
    job.done();
  }
  catch (ex) {
    console.log(`Harvest job exception for ${job.data.script}`);
    job.fail(ex);
  }
  callback();
});

allJobs.startJobServer();
allJobs.setLogStream(process.stdout);

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
    const job = new Job(allJobs, 'harvest', { script: source.script });
    job.repeat({ schedule: allJobs.later.parse.text(`every ${source.interval} mins`) });
    job.save();
  }
}