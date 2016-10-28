import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Gauges } from '../gauges';

export const Measurements = new Mongo.Collection('measurements');

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
  value: {
    type: Number,
    label: 'Value',
    optional: true,
    decimal: true,
  },
});

Measurements.attachSchema(measurementsSchema);

if (Meteor.isServer) {
  Measurements._ensureIndex({ gaugeId: 1, date: -1 }, { unique: true });
}  

//denormalize gauges
Measurements.after.insert(function (userId, doc) {
  Gauges.update(doc.gaugeId, { $set: { lastTimestamp: doc.date, lastValue: doc.value } });
});