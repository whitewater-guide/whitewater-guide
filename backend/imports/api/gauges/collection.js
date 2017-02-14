import SimpleSchema from 'simpl-schema';
import {metaSchema} from '../../utils/SimpleSchemaUtils';
import {I18nCollection} from '../../i18n';
import {registerHooks} from './hooks';
import {PointInputSchema} from '../points';
import cronParser from "cron-parser";
import _ from 'lodash';

const i18Schema = {
  name: String
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  sourceId: {type: String, regEx: SimpleSchema.RegEx.Id},
  code: {type: String},
  url: {type: String, regEx: SimpleSchema.RegEx.Url},
  location: PointInputSchema,
  lastTimestamp: Date,
  levelUnit: String,
  flowUnit: String,
  lastLevel: Number,
  lastFlow: Number,
  requestParams: {type: Object, blackbox: true},
  cron: {
    type: String,
    custom: function () {
      if (this.value) {
        try {
          cronParser.parseExpression(this.value);
        }
        catch (e) {
          return 'notAllowed';
        }
      }
    },
  },
  enabled: Boolean,
};

const dbSchema = _.merge(
  baseSchema,
  {
    name: {required: true, index: true},
    sourceId: {required: true, index: true},
    code: {type: String, index: true},
  },
  metaSchema(),
);

export const Gauges = new I18nCollection('gauges');
Gauges.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Gauges.attachI18Schema(i18Schema);

registerHooks(Gauges);