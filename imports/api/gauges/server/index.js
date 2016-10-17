import { Gauges } from '../index';
import { startJobs, stopJobs } from '../../jobs/server';

//Enabled/disabled hook adds/removes jobs
Gauges.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (fieldNames.includes('enabled')) {
    if (doc.enabled) {
      startJobs(doc.source, doc._id);
    }
    else {
      stopJobs(doc.source, doc._id);
    }
  }
}, { fetchPrevious: false });

//Remove jobs on gauge removal
Gauges.after.remove(function (gaugeId, doc) {
  stopJobs(doc.source, doc._id);
});