import {Gauges} from '../index';
import {startJobs, stopJobs} from '../../jobs/server';
import {Points} from '../../points';

//Enabled/disabled hook adds/removes jobs
Gauges.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (fieldNames.includes('enabled')) {
    if (doc.enabled) {
      startJobs(doc.sourceId, doc._id);
    }
    else {
      stopJobs(doc.sourceId, doc._id);
    }
  }
}, {fetchPrevious: false});

//Remove jobs on gauge removal
Gauges.after.remove(function (gaugeId, doc) {
  stopJobs(doc.sourceId, doc._id);
  if (doc.location && doc.location._id){
    Points.remove({_id: doc.location._id});
  }
});