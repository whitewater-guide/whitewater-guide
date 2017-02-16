import SimpleSchema from 'simpl-schema';
import {I18nCollection} from '../../i18n';
import {metaSchema} from '../../utils/SimpleSchemaUtils';
import {registerHooks} from './hooks';
import {PointInputSchema} from '../points';
import _ from 'lodash';
import {GaugeBindingSchema} from './gaugebinding';
import {Durations} from './durations';

const i18Schema = {
  name: String,
  description: String,
  season: String,
  riverName: String,
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  riverId: {type: String, regEx: SimpleSchema.RegEx.Id},
  regionId: {type: String, regEx: SimpleSchema.RegEx.Id},
  gaugeId: {type: String, regEx: SimpleSchema.RegEx.Id},
  putIn: PointInputSchema,
  takeOut: PointInputSchema,
  distance: Number,
  duration: {type: SimpleSchema.Integer, allowedValues: _.map(Durations, 'value')},
  drop: Number,
  rating: {type: Number, min: 0, max: 5, defaultValue: 0},
  difficulty: {type: Number, min: 1, max: 6},
  difficultyXtra: String,
  levels: GaugeBindingSchema,
  flows: GaugeBindingSchema,
  seasonNumeric: Array,
  "seasonNumeric.$": {type: SimpleSchema.Integer, min: 0, max: 23},
};

const dbSchema = _.merge(
  baseSchema,
  {
    name: {required: true, index: true},
    riverId: {required: true, index: true},
    regionId: {required: true, index: true},
    mediaIds: [String],
    poiIds: [String],
    supplyTagIds: {type: Array, defaultValue: []},
    kayakingTagIds: {type: Array, defaultValue: []},
    hazardsTagIds: {type: Array, defaultValue: []},
    miscTagIds: {type: Array, defaultValue: []},
    "supplyTagIds.$": {type: String, regEx: SimpleSchema.RegEx.Id},
    "kayakingTagIds.$": {type: String, regEx: SimpleSchema.RegEx.Id},
    "hazardsTagIds.$": {type: String, regEx: SimpleSchema.RegEx.Id},
    "miscTagIds.$": {type: String, regEx: SimpleSchema.RegEx.Id},
    putIn: {required: String},
    takeOut: {required: String},
    difficulty: {required: true, index: true},
  },
  metaSchema(),
);

export const Sections = new I18nCollection('sections');
Sections.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Sections.attachI18Schema(i18Schema);

registerHooks(Sections);