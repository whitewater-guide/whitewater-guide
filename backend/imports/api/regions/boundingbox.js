import SimpleSchema from 'simpl-schema';

const limits = [
  {min: -180, max: 180, msg: 'lonOutOfRange'},
  {min: -90, max: 90, msg: 'latOutOfRange'},
];

export const BoundingBoxSchema = new SimpleSchema({
  sw: {
    type: Array,
    label: 'South-west corner Longitude & Latitude',
    minCount: 2,
    maxCount: 2,
    optional: true,
  },
  "sw.$": {
    type: Number,
    custom: function () {
      const index = Number(this.key.match(/\d+/)[0]);
      const limit = limits[index];
      if (this.value === null || this.value === undefined)
        return 'required';
      if (this.value >= limit.max || this.value <= limit.min)
        return limit.msg;
    },
  },
  ne: {
    type: Array,
    label: 'North-east corner Longitude & Latitude',
    minCount: 2,
    maxCount: 2,
    optional: true,
  },
  "ne.$": {
    type: Number,
    custom: function () {
      const index = Number(this.key.match(/\d+/)[0]);
      const limit = limits[index];
      if (this.value === null || this.value === undefined)
        return 'required';
      if (this.value >= limit.max || this.value <= limit.min)
        return limit.msg;
    },
  },
  autocompute: {
    type: Boolean,
    label: 'Compute bounding box automatically',
    defaultValue: true,
    optional: true,
  },
});
