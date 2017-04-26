import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
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
  Gauges.update(
    {$and: [
      {_id: doc.gaugeId},
      {$or: [ {lastTimestamp: {$exists: false}}, {lastTimestamp: {$lt: doc.date}} ] }
    ]},
    {$set: {lastTimestamp: doc.date, lastLevel: doc.level, lastFlow: doc.flow}}
  );
  let numSectionsUpdated = Sections.update(
    {$and: [
      {gaugeId: doc.gaugeId},
      {$or: [
        {$and: [{levels: {$exists: true}}, {levels: {$ne: null}}, {"levels.lastTimestamp": { $lt: doc.date }}]},
        {$and: [{flows: {$exists: true}}, {flows: {$ne: null}}, {"flows.lastTimestamp": { $lt: doc.date }}]},
      ]}
    ]},
    {$set: {
      "levels.lastTimestamp": doc.date,
      "levels.lastValue": doc.level,
      "flows.lastTimestamp": doc.date,
      "flows.lastValue": doc.flow,
    }},
    {multi: true}
  );
  numSectionsUpdated += Sections.update(
    {$and: [
      {gaugeId: doc.gaugeId},
      {$or: [{ levels: null}, { flows: null},] }
    ]},
    {$set: {
      levels: {lastTimestamp: doc.date, lastValue: doc.level},
      flows: {lastTimestamp: doc.date, lastValue: doc.flow},
    }},
    {multi: true}
  );
  if (numSectionsUpdated > 0) {
    const updates = Sections.find({ gaugeId: doc.gaugeId }, { fields: { levels: 1, flows: 1, regionId: 1 } }).fetch();
    pubsub.publish('measurementsUpdated', updates);
  }
});