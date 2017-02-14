import {Gauges} from '../gauges';
import {startJobs, stopJobs} from '../jobs';

export function registerHooks(Sources) {
  Sources.after.remove(function (sourceId, sourceDoc) {
    Gauges.remove({sourceId: sourceDoc._id});
    stopJobs(sourceId);
  });

  //Enabled/disabled hook adds/removes jobs
  Sources.after.update(function (userId, doc, fieldNames) {
    if (fieldNames.includes('enabled')) {
      if (doc.harvestMode === 'allAtOnce') {
        if (doc.enabled)
          startJobs(doc._id);
        else
          stopJobs(doc._id);
      }
      else {
        //For one-by-one sources, disabling them disables all their gauges
        //But enabling them does not affect gauges, use separate method for this
        if (!doc.enabled)
          Gauges.update({sourceId: doc._id}, {$set: {enabled: false}}, {multi: true});
      }
    }
  }, {fetchPrevious: false});
}