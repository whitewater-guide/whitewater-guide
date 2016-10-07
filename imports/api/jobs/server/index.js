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
  }
  job.done(`Removed ${ids.length} old jobs`);
  callback();
});

Jobs.find({status: 'ready'})
  .observe({ added: function () { cleanupQueue.trigger(); } });

Jobs.processJobs('harvest', {}, (job, callback) => {
  const launchScriptFiber = Meteor.wrapAsync(worker);
  try {
    const measurements = launchScriptFiber(job.data);
    let insertCount = 0;
    measurements.forEach(measurement => {
      const gaugeId = job.data.gaugeId ? job.data.gaugeId : Gauges.findOne({ source: job.data.source, code: measurement.code })._id;
      if (measurement.value) {
        Measurements.insert({
          gauge: gaugeId,
          date: new Date(measurement.timestamp),
          value: measurement.value,
        }, (err) => { if (!err) insertCount++ });
      }
    });
    job.done(`Collected ${insertCount} from ${job.data.script} gauges`);
  }
  catch (ex) {
    console.log(`Harvest job exception for ${job.data.script}`);
    job.fail(ex);
  }
  callback();
});

Jobs.startJobServer();
Jobs.setLogStream(process.stdout);

function worker({script, gaugeId}, nodeCallback) {
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  //It is possible to check gauge's last timestamp here and pass it to worker
  const gauge = gaugeId && Gauges.findOne(gaugeId);
  const args = ['harvest'];
  if (gauge) {
    args.push(gauge.code, gauge.lastTimestamp);
  }
  const child = child_process.fork(file, args);
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
  else if (source.harvestMode === 'oneByOne') {
    const gauges = source.gauges().fetch();
    const numGauges = gauges.length;
    if (numGauges === 0)
      return;
    const step = Math.floor(source.interval / numGauges);
    for (let i = 0; i < numGauges; i++){
      const gauge = gauges[i];
      const job = new Job(Jobs, 'harvest', {
        script: source.script,
        source: source._id,
        gaugeId: gauge._id, 
      });
      job.repeat({ schedule: Jobs.later.parse.recur().on(i * step).minute() });
      job.save();
    }
  }
}