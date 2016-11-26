import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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
  'paid-camping'
];

export const LocationSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  "type":{
    type: String,
    allowedValues: ["Point"],
    //defaultValue is not set, so coordinate field can be optional inside other scheme
  },
  coordinates: {
    type: [Number],
    label: 'Longitude & Latitude',
    decimal: true,
    minCount: 2,
    maxCount: 2,
  },
  "coordinates.$": {
    custom: function(){
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
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
  kind: {
    type: String,
    label: 'Type of point',
    optional: true,
    allowedValues: POITypes
  },
});

LocationSchema.messages = {
  lonOutOfRange: 'Longitude out of range', // Must be between -90 and 90
  latOutOfRange: 'Latitude out of range' // Must be between -180 and 180
};