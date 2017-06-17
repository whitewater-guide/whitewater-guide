import SimpleSchema from 'simpl-schema';
import {I18nCollection} from '../../i18n';
import {metaSchema} from "../../utils/SimpleSchemaUtils";
import { POITypes } from '../../commons/features/points'
import _ from 'lodash';

const limits = [
  {min: -180, max: 180, msg: 'lonOutOfRange'},
  {min: -90, max: 90, msg: 'latOutOfRange'},
  {min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY, msg: 'altOutOfRange'},
];

const i18Schema = {
  name: String,
  description: String,
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  coordinates: {
    type: Array,
    label: 'Longitude / Latitude / Altitude',
    minCount: 2,
    maxCount: 3,
  },
  "coordinates.$": {
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
  kind: {type: String},
};

const dbSchema = _.merge(
  baseSchema,
  {
    coordinates: {required: true},
    kind: {required: true, allowedValues: POITypes},
  },
  metaSchema(),
);

export const Points = new I18nCollection('points');
export const PointSchema = new SimpleSchema(dbSchema, {requiredByDefault: false});
export const PointInputSchema = new SimpleSchema(baseSchema, {requiredByDefault: false});

Points.attachSchema(PointSchema);
Points.attachI18Schema(i18Schema);


