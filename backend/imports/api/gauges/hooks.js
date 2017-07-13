import {startJobs, stopJobs} from "../jobs";
import {Points} from "../points";

export function registerHooks(Gauges) {
  //Enabled/disabled hook adds/removes jobs
  Gauges.after.update(function (userId, nextGaugeDoc) {
    const prevGaugeDoc = this.previous;
    if (prevGaugeDoc.enabled && !nextGaugeDoc.enabled) {
      stopJobs(nextGaugeDoc.sourceId, nextGaugeDoc._id);
    } else if (!prevGaugeDoc.enabled && nextGaugeDoc.enabled) {
      startJobs(null, nextGaugeDoc);
    }
  });

  //Remove jobs on gauge removal
  Gauges.after.remove(function (gaugeId, gaugeDoc) {
    stopJobs(gaugeDoc.sourceId, gaugeDoc._id);
    if (gaugeDoc.location && gaugeDoc.location._id) {
      Points.remove({_id: gaugeDoc.location._id});
    }
  });
}