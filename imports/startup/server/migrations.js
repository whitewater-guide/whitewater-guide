import {Meteor} from 'meteor/meteor';
import {Migrations} from 'meteor/percolate:migrations';
import {Gauges} from '../../api/gauges';
import {Points} from '../../api/points';
import {Measurements} from '../../api/measurements';
import {Sections, Durations} from '../../api/sections';
import _ from 'lodash';

Migrations.add({
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
});

/**
 * Measurement now include 'level' and 'flow' instead of value.
 * All the denormalized values (Gauge and Section) are updated as well
 */
Migrations.add({
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
        .updateOne({$rename: {'lastValue': 'lastLevel', 'unit': 'levelUnit'}, $set: {'lastFlow': 0, 'flowUnit': ''}, $unset: {'measurement': ''}});
    });

    if (hasGaugesUpdates) {
      const executeGaugesBatch = Meteor.wrapAsync(gaugesBatch.execute, gaugesBatch);
      gaugesBatchSucceed = executeGaugesBatch();
    }

    return measurementsBatchSucceed && gaugesBatchSucceed;
  }
});

/**
 * Convert section duration from string enum to number, for better sorting
 */
Migrations.add({
  version: 3,
  up: function migration3up() {
    const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
    let hasUpdates = false;
    const durationsMap = _.reduce(
      Durations,
      (result, value) => ( {...result, [value.slug]: value.value}),
      {}
    );
    Sections.find({}).forEach(section => {
        if (_.isString(section.duration)) {
          hasUpdates = true;
          sectionsBatch.find({_id: section._id}).updateOne({$set: {"duration": durationsMap[section.duration]}});
        }
    });

    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
      return executeSectionsBatch();
    }

    return true;
  }
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});