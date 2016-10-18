import { Sources } from '../index';
import { Gauges } from '../../gauges';
import { startJobs, stopJobs } from '../../jobs/server';  

Sources.after.remove(function (sourceId, sourceDoc) {
  Gauges.remove({ source: sourceDoc._id });
  stopJobs(sourceId);
});

//Enabled/disabled hook adds/removes jobs
Sources.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (fieldNames.includes('enabled')) {
    if (doc.harvestMode === 'allAtOnce') {
      if (doc.enabled)
        startJobs(doc._id);
      else
        stopJobs(doc._id);
    }
    else {
      //For one-by-one sources, disbaling them disables all their gauges
      //But enabling them does not affect gauges, use separate method for this
      if (!doc.enabled)
        Gauges.update({ source: doc._id }, { $set: { enabled: false } }, { multi: true });
    }
  }
}, {fetchPrevious: false} );