import child_process from 'child_process';
import { cancelJob, scheduleJob } from 'node-schedule';
import path from 'path';
import { Meteor } from 'meteor/meteor';
import { Gauges } from '../gauges';
import { Sources } from '../sources';
import { Measurements } from '../measurements';

export function startJobs(source, gauge = null) {
  if (!source && gauge) {
    source = Sources.findOne(gauge.sourceId);
  }
  const { _id: sourceId, harvestMode, script } = source;
  if (gauge) {
    scheduleJob(`${sourceId}_${gauge._id}`, gauge.cron, createGaugeJob(script, gauge._id, gauge.requestParams));
  } else if (harvestMode === 'allAtOnce') {
    scheduleJob(sourceId, source.cron, createSourceJob(sourceId, script));
  } else {
    Gauges.find({ sourceId, enabled: true }).forEach(gauge => startJobs(source, gauge));
  }
}

export function stopJobs(sourceId, gaugeId) {
  const jobId = gaugeId ? `${sourceId}_${gaugeId}`: sourceId;
  cancelJob(jobId);
}

function createSourceJob(sourceId, script) {
  return Meteor.bindEnvironment(() => {
    const launchScriptFiber = Meteor.wrapAsync(sourceWorker);
    const measurements = launchScriptFiber({ script });
    measurements.forEach(({ code, timestamp, level, flow }) => {
      const { lastTimestamp, _id: gaugeId } = Gauges.findOne({ sourceId, code: String(code) }) || {};
      const date = new Date(timestamp);
      if (gaugeId && (level || flow) && (!lastTimestamp || date > lastTimestamp)) {
        Measurements.insert({ gaugeId, date, level, flow }, () => {});
      }
    });
  });
}

function createGaugeJob(script, gaugeId, requestParams) {
  return Meteor.bindEnvironment(() => {
    const { code, lastTimestamp } = Gauges.findOne(gaugeId);
    const launchScriptFiber = Meteor.wrapAsync(gaugeWorker);
    const measurements = launchScriptFiber({ script, code, lastTimestamp, requestParams });
    measurements.forEach(({ timestamp, level, flow }) => {
      const date = new Date(timestamp);
      if (gaugeId && (level || flow) && (!lastTimestamp || date > lastTimestamp)) {
        Measurements.insert({ gaugeId, date, level, flow }, () => {});
      }
    });
  });
}

function sourceWorker({ script }, meteorCallback) {
  worker({}, script, meteorCallback);
}

function gaugeWorker({ script, code, lastTimestamp, requestParams }, meteorCallback) {
  worker({ code, lastTimestamp, requestParams }, script, meteorCallback);
}

function worker(options, script, meteorCallback) {
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  const child = child_process.fork(file, ['harvest'], { execArgv: [] });
  let response;

  child.on('close', (code) => {
    if (code === 0) {
      meteorCallback(undefined, response);
    }
    else {
      meteorCallback(response);
    }
  });

  child.on('message', (data) => {
    response = data;
  });

  //This will actually start the worker script
  child.send(options);
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
