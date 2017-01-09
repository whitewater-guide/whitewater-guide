import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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