import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Source} from './sources';

export const Gauges = new Mongo.Collection('gauges');

const gaugesSchema = new SimpleSchema({
  source: {
    type: Meteor.ObjectID,
    label: 'Gauge source',
  },
  name: {
    type: String,
    label: 'Gauge name',
    max: 200,
  },
  code: {
    type: String,
    label: 'Unique code',
    max: 100,
  },
  altitide: {
    type: Number,
    label: 'Altitude',
    decimal: true,
    optional: true,
  },
  latitude: {
    type: Number,
    label: 'Latitude',
    decimal: true,
    optional: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    label: 'Longitude',
    decimal: true,
    optional: true,
    min: -180,
    max: 180,
  },
  unit: {
    type: String,
    defaultValue: 'cm',
    label: 'Measurement unit'
  },
  measurement: {
    type: String,
    defaultValue: 'Water level',
    label: 'Type of measurement',
  },
  requestParams: {
    type: Object,
    label: 'Additional API request parameters',
    optional: true,
  },
  lastTimestamp: {
    type: Date,
    label: 'Last measurement timestamp',
    optional: true,
  },
  lastValue: {
    type: Number,
    label: 'Last measured value',
    optional: true,
  },
  url: {
    type: String,
    label: 'URL',
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  disabled: {
    type: Boolean,
    label: 'Is disabled',
    defaultValue: false,
  },
});

Gauges.attachSchema(gaugesSchema);

export const createGauge = new ValidatedMethod({
  name: 'gauges.create',

  mixins: [CallPromiseMixin],

  validate: gaugesSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    //Later add auth check here
    return Gauges.insert(data);
  }
});

export const removeGauge = new ValidatedMethod({
  name: 'gauges.remove',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    gaugeId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({gaugeId}) {
    return Gauges.remove(gaugeId);
  },
  
});

Gauges.helpers({
  source(){
    return Source.findOne(this.source);
  },
});