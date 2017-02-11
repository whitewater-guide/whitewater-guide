import {Measurements} from "../api/measurements";
import {Meteor} from "meteor/meteor";

/**
 * Measurement now include 'level' and 'flow' instead of value.
 * All the denormalized values (Gauge and Section) are updated as well
 */
export default {
  version: 2,
  up: function migration2Up() {
    const measurementsBatch = Measurements.rawCollection().initializeUnorderedBulkOp();
    let hasMeasurementUpdates = false;
    let measurementsBatchSucceed = true;
    Measurements.find({}).forEach(measurement => {
      hasMeasurementUpdates = true;
      measurementsBatch
        .find({_id: measurement._id})
        .updateOne({$rename: {value: 'level'}, $set: {flow: 0}});
    });

    if (hasMeasurementUpdates) {
      const executeMeasurementsBatch = Meteor.wrapAsync(measurementsBatch.execute, measurementsBatch);
      measurementsBatchSucceed = executeMeasurementsBatch();
    }

    const gaugesBatch = Gauges.rawCollection().initializeUnorderedBulkOp();
    let hasGaugesUpdates = false;
    let gaugesBatchSucceed = true;
    Gauges.find({}).forEach(gauge => {
      hasGaugesUpdates = true;
      gaugesBatch
        .find({_id: gauge._id})
        .updateOne({
          $rename: {'lastValue': 'lastLevel', 'unit': 'levelUnit'},
          $set: {'lastFlow': 0, 'flowUnit': ''},
          $unset: {'measurement': ''}
        });
    });

    if (hasGaugesUpdates) {
      const executeGaugesBatch = Meteor.wrapAsync(gaugesBatch.execute, gaugesBatch);
      gaugesBatchSucceed = executeGaugesBatch();
    }

    return measurementsBatchSucceed && gaugesBatchSucceed;
  }
};