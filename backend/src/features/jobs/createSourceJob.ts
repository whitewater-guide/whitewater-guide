// function createSourceJob(sourceId, script) {
//   return Meteor.bindEnvironment(() => {
//     const launchScriptFiber = Meteor.wrapAsync(sourceWorker);
//     const measurements = launchScriptFiber({ script });
//     measurements.forEach(({ code, timestamp, level, flow }) => {
//       const { lastTimestamp, _id: gaugeId } = Gauges.findOne({ sourceId, code: String(code) }) || {};
//       const date = new Date(timestamp);
//       if (gaugeId && (level || flow) && (!lastTimestamp || date > lastTimestamp)) {
//         Measurements.insert({ gaugeId, date, level, flow }, () => {});
//       }
//     });
//   });
// }
import { JobCallback } from 'node-schedule';
import { SourceRaw } from '../sources';

const createSourceJob = (source: SourceRaw): JobCallback => {
  return () => {};
};

export default createSourceJob;
