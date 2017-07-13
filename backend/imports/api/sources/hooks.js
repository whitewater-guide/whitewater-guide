import {Gauges} from '../gauges';
import {startJobs, stopJobs} from '../jobs';

export function registerHooks(Sources) {
  Sources.after.remove(function (sourceId, sourceDoc) {
    Gauges.remove({sourceId: sourceDoc._id});
    stopJobs(sourceId);
  });

  //Enabled/disabled hook adds/removes jobs
  Sources.after.update(function (userId, doc) {
    const enable = doc.enabled && !this.previous.enabled;
    const disable = !doc.enabled && this.previous.enabled;
    if (enable) {
      if (doc.harvestMode === 'allAtOnce') {
        startJobs(doc);
      } else {
        Gauges.update({ sourceId: doc._id }, { $set: { enabled: true } }, { multi: true });
      }
    } else if (disable) {
      if (doc.harvestMode === 'allAtOnce') {
        stopJobs(doc._id);
      } else {
        Gauges.update({sourceId: doc._id}, {$set: {enabled: false}}, {multi: true});
      }
    }
  });
}