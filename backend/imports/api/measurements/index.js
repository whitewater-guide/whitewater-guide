import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
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
    decimal: true,
  },
  flow: {
    type: Number,
    label: 'Flow',
    optional: true,
    decimal: true,
  },
});

Measurements.attachSchema(measurementsSchema);

//denormalize gauges and sections
Measurements.after.insert(function (userId, doc) {
  Gauges.update(
    doc.gaugeId,
    {$set: {lastTimestamp: doc.date, lastLevel: doc.level, lastFlow: doc.flow}}
  );
  Sections.update(
    {gaugeId: doc.gaugeId},
    {$set: {
      "levels.lastTimestamp": doc.date,
      "levels.lastValue": doc.level,
      "flows.lastTimestamp": doc.date,
      "flows.lastValue": doc.flow,
    }},
    {multi: true}
  );
});