import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

export const Measurements = new Mongo.Collection('measurements');

export const measurementsSchema = new SimpleSchema({
  gauge: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Gauge id',
    index: true,
  },
  date: {
    type: Date,
    label: 'Timestamp',
    optional: true,
  },
  value: {
    type: Number,
    label: 'Value',
    optional: true,
    decimal: true,
  },
});

Measurements.attachSchema(measurementsSchema);