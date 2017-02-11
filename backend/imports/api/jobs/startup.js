import {Job} from 'meteor/vsivsi:job-collection';
import {Sources} from '../sources';
import {Measurements} from '../measurements';
import {Gauges} from '../gauges';
import {Meteor} from 'meteor/meteor';
import {after} from 'lodash';
import path from 'path';
import child_process from 'child_process';
import {Jobs} from './collection'
import {stopJobs, startJobs} from './methods';

export function startJobServer() {
  new Job(Jobs, 'cleanup', {})
    .repeat({schedule: Jobs.later.parse.text("every 5 minutes")})
    .save({cancelRepeats: true});

  const cleanupQueue = Jobs.processJobs('cleanup', {pollInterval: false, workTimeout: 60 * 1000}, (job, callback) => {
    const current = new Date();
    current.setMinutes(current.getMinutes() - 5);
    const ids = Jobs.find(
      {
        status: {$in: Job.jobStatusRemovable},
        updated: {$lt: current},
      },
      {fields: {_id: 1}}
    ).map(d => d._id);

    if (ids.length > 0) {
      Jobs.removeJobs(ids);
    }
    job.done(`Removed ${ids.length} old jobs`);
    callback();
  });

  Jobs.find({status: 'ready'})
    .observe({
      added: function () {
        cleanupQueue.trigger();
      }
    });

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
      const finishJob = after(measurements.length, () => {
        job.done({measurements: insertCount});
        console.info(`Harvested ${insertCount} measurements for task ${JSON.stringify(job.data)}`);
        callback();
      });
      if (measurements.length === 0) {
        finishJob();
      }
      measurements.forEach(measurement => {
        let gaugeId = job.data.gaugeId;//For one by one sources
        if (!gaugeId) {//For allAtOnce sources
          let gauge = Gauges.findOne({sourceId: job.data.sourceId, code: String(measurement.code)});
          if (gauge)//Gauge might be deleted
            gaugeId = gauge._id;
        }
        if (gaugeId && (measurement.level || measurement.flow)) {
          Measurements.insert({
            gaugeId: gaugeId,
            date: new Date(measurement.timestamp),
            level: measurement.level,
            flow: measurement.flow,
          }, (err) => {
            if (err)
              console.warn(`Error while inserting measurement into ${gaugeId}: ${err}`);
            else
              insertCount++;
            finishJob();
          });
        }
        else {
          finishJob();
        }
      });
    }
    catch (ex) {
      console.error(`Harvest job exception for ${job.data.script}: ${ex}`);
      job.fail({reason: `Harvest job exception for ${job.data.script}`});
      callback();
    }
  });

  Jobs.startJobServer();

}

function worker({script, gaugeId}, nodeCallback) {
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  //It is possible to check gauge's last timestamp here and pass it to worker
  const gaugeDoc = gaugeId && Gauges.findOne(gaugeId);
  let options = {};
  if (gaugeDoc) {
    options.code = gaugeDoc.code;
    if (gaugeDoc.lastTimestamp)
      options.lastTimestamp = gaugeDoc.lastTimestamp;
    if (gaugeDoc.requestParams)
      options = {...options, ...gaugeDoc.requestParams};
  }
  console.log(`Launching worker ${script} harvest with options ${JSON.stringify(options)}`);
  const child = child_process.fork(file, ['harvest'], {execArgv: []});
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

  //This will actually start the worker script
  child.send(options);
}

