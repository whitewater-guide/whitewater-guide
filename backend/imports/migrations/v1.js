import {Gauges} from '../api/gauges';
import {Points} from '../api/points';
import {Meteor} from 'meteor/meteor';

export default {
  version: 1,
  up: function migration1up() {
    const gaugesBatch = Gauges.rawCollection().initializeUnorderedBulkOp();
    const pointsBatch = Points.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    Gauges.find({}).forEach(gauge => {
      if (gauge.location && gauge.location._id) {
        hasUpdates = true;
        gaugesBatch.find({_id: gauge._id}).updateOne({$set: {"location.kind": 'gauge'}});
        pointsBatch.find({_id: gauge.location._id}).updateOne({$set: {kind: 'gauge'}});
      }
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeGaugesBatch = Meteor.wrapAsync(gaugesBatch.execute, gaugesBatch);
      const executePointsBatch = Meteor.wrapAsync(pointsBatch.execute, pointsBatch);
      return executeGaugesBatch() && executePointsBatch();
    }

    return true;
  }
}