import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {Gauges} from '../gauges';
import {Sections} from '../sections';

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
    {_id: doc.gaugeId, lastTimestamp: { $lt: doc.date }},
    {$set: {lastTimestamp: doc.date, lastLevel: doc.level, lastFlow: doc.flow}}
  );
  Sections.update(
    {$and: [
      {gaugeId: doc.gaugeId},
      {$or: [
        {"levels.lastTimestamp": { $lt: doc.date }},
        {"flows.lastTimestamp": { $lt: doc.date }},
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
});