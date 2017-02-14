import {I18nCollection} from '../../i18n';
import SimpleSchema from 'simpl-schema';
import {metaSchema} from "../../utils/SimpleSchemaUtils";
import _ from "lodash";
import {BoundingBoxSchema} from "./boundingbox";

const i18Schema = {
  name: String,
  description: String,
  season: String,
};

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
  bounds: BoundingBoxSchema,

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
