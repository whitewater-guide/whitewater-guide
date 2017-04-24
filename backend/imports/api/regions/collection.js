import {I18nCollection} from '../../i18n';
import SimpleSchema from 'simpl-schema';
import {metaSchema} from "../../utils/SimpleSchemaUtils";
import _ from "lodash";

const i18Schema = {
  name: String,
  description: String,
  season: String,
};

const limits = [
  {min: -180, max: 180, msg: 'lonOutOfRange'},
  {min: -90, max: 90, msg: 'latOutOfRange'},
];

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  seasonNumeric: Array,
  "seasonNumeric.$": {
    type: SimpleSchema.Integer,
    min: 0,
    max: 23,
    maxCount: 24,
  },
  bounds: Array,
  "bounds.$": {type: Array},
  "bounds.$.$": {
    type: Number,
    custom: function () {
      const index = Number(this.key.match(/\d+$/)[0]);
      const limit = limits[index];
      if (this.value === null || this.value === undefined)
        return 'required';
      if (this.value >= limit.max || this.value <= limit.min)
        return limit.msg;
    },
  },
};

const dbSchema = _.merge(
  baseSchema,
  {
    name: {required: true, index: true},
    poiIds: [String],
  },
  metaSchema(),
);

export const Regions = new I18nCollection('regions');
Regions.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Regions.attachI18Schema(i18Schema);
