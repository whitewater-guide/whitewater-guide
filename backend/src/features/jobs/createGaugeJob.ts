// function createGaugeJob(script, gaugeId, requestParams) {
//   const { code, lastTimestamp } = Gauges.findOne(gaugeId);
//   const launchScriptFiber = Meteor.wrapAsync(gaugeWorker);
//   const measurements = launchScriptFiber({ script, code, lastTimestamp, requestParams });
//   measurements.forEach(({ timestamp, level, flow }) => {
//     const date = new Date(timestamp);
//     if (gaugeId && (level || flow) && (!lastTimestamp || date > lastTimestamp)) {
//       Measurements.insert({ gaugeId, date, level, flow }, () => {});
//     }
//   });
// }
import { JobCallback } from 'node-schedule';
import { GaugeRaw } from '../gauges';
import { SourceRaw } from '../sources';

const createGaugeJob = (source: SourceRaw, gauge: GaugeRaw): JobCallback => {
  return () => {};
};

export default createGaugeJob;
