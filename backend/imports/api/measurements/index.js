import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { get } from 'lodash';
import {Gauges} from '../gauges';
import {Sections} from '../sections';
import { pubsub } from '../../subscriptions';

export const Measurements = new Mongo.Collection('measurements');
Measurements._ensureIndex({gaugeId: 1, date: -1}, {unique: true});

export const measurementsSchema = new SimpleSchema({
  gaugeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Gauge',
  },
  date: {
    type: Date,
    label: 'Timestamp',
  },
  level: {
    type: Number,
    label: 'Level',
    optional: true,
  },
  flow: {
    type: Number,
    label: 'Flow',
    optional: true,
  },
});

Measurements.attachSchema(measurementsSchema);

//denormalize gauges and sections
Measurements.after.insert(function (userId, doc) {

  const gaugesBatch = Gauges.rawCollection().initializeUnorderedBulkOp();
  let hasGaugesUpdates = false;

  Gauges.find({_id: doc.gaugeId}).forEach(gauge => {
    if (!gauge.lastTimestamp || gauge.lastTimestamp < doc.date) {
      hasGaugesUpdates = true;
      gaugesBatch.find({_id: gauge._id}).updateOne({
        $set: {lastTimestamp: doc.date, lastLevel: doc.level, lastFlow: doc.flow}
      });
    }
  });

  if (hasGaugesUpdates) {
    const executeGaugesBatch = Meteor.wrapAsync(gaugesBatch.execute, gaugesBatch);
    executeGaugesBatch();
  }

  const sectionsBatch = Sections.rawCollection().initializeUnorderedBulkOp();
  let hasSectionsUpdates = false;
  const sectionsUpdates = [];

  Sections.find({gaugeId: doc.gaugeId}).forEach(section => {
    const lastTimestamp = get(section, 'levels.lastTimestamp') || get(section, 'flows.lastTimestamp');
    if (!lastTimestamp || lastTimestamp < doc.date) {
      hasSectionsUpdates = true;
      const levels = Object.assign({}, section.levels, {lastTimestamp: doc.date, lastValue: doc.level});
      const flows = Object.assign({}, section.flows, {lastTimestamp: doc.date, lastValue: doc.flow});
      sectionsBatch.find({_id: section._id}).updateOne({
        $set: {levels, flows}
      });
      sectionsUpdates.push({_id: section._id, levels, flows, regionId: section.regionId});
    }
  });

  if (hasSectionsUpdates) {
    const executeSectionsBatch = Meteor.wrapAsync(sectionsBatch.execute, sectionsBatch);
    executeSectionsBatch();
    pubsub.publish('measurementsUpdated', sectionsUpdates);
  }
});