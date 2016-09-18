import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const Gauges = new Mongo.Collection('sources');

Gauges.attachSchema(new SimpleSchema({
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
  interval: {
    type: Number,
    label: 'Harvesting interval in minutes',
    optional: true,
    min: 1,
    max: 2880, //2 days
    defaultValue: 60,
  },
  harvestMode: {
    type: String,
    label: 'Harvest mode',
    allowedValues: ['allAtOnce', 'oneByOne'],
    defaultValue: 'allAtOnce',
  },
  url: {
    type: String,
    label: 'URL',
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  source: {
    type: String,
    label: 'Gauge source',
    regEx: SimpleSchema.RegEx.Id,
  },
}));

export default Gauges;