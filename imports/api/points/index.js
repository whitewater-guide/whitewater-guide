import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {TAPi18n} from 'meteor/tap:i18n';

const limits = [
  {min: -90, max: 90, msg: 'lonOutOfRange'},
  {min: -180, max: 180, msg: 'latOutOfRange'},
];

export const POITypes = [
  'put-in',
  'put-in-alt',
  'take-out',
  'take-out-alt',
  'waterfall',
  'rapid',
  'portage',
  'playspot',
  'hazard',
  'river-campsite',
  'wild-camping',
  'paid-camping',
  'gauge',
  'other',
];

export const PointI18nSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

export const PointSchema = new SimpleSchema([
  PointI18nSchema,
  {
    "type": {
      type: String,
      allowedValues: ['Point'],
      defaultValue: 'Point',
    },
    coordinates: {
      type: [Number],
      label: 'Longitude & Latitude',
      decimal: true,
      minCount: 2,
      maxCount: 2,
    },
    "coordinates.$": {
      custom: function () {
        const index = Number(this.key.match(/\d+/)[0]);
        const limit = limits[index];
        if (this.value === null || this.value === undefined)
          return 'required';
        if (this.value >= limit.max || this.value <= limit.min)
          return limit.msg;
      },
    },
    altitude: {
      type: Number,
      label: 'Altitude',
      decimal: true,
      optional: true,
    },
    kind: {
      type: String,
      label: 'Type of point',
      defaultValue: 'other',
      allowedValues: POITypes
    },
    i18n: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }
]);

export const PointSchemaWithId = new SimpleSchema([PointSchema, {_id: {type: String, regEx: SimpleSchema.RegEx.Id}}]);

PointSchema.messages = {
  lonOutOfRange: 'Longitude out of range', // Must be between -90 and 90
  latOutOfRange: 'Latitude out of range' // Must be between -180 and 180
};

export const Points = new TAPi18n.Collection('points');

Points.attachSchema(PointSchema);
Points.attachI18Schema(PointI18nSchema);