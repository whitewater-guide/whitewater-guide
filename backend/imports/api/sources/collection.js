import SimpleSchema from 'simpl-schema';
import {metaSchema} from '../../utils/SimpleSchemaUtils';
import {I18nCollection} from '../../i18n';
import {registerHooks} from './hooks';
import _ from 'lodash';
import cronParser from 'cron-parser';

const i18Schema = {
  name: {type: String, required: true},
  termsOfUse: String,
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  script: {type: String, required: true},
  cron: {
    type: String,
    custom: function () {
      try {
        cronParser.parseExpression(this.value);
      }
      catch (e) {
        return 'notAllowed';
      }
    },
  },
  harvestMode: {type: String, required: true},
  url: {type: String, regEx: SimpleSchema.RegEx.Url},
  enabled: Boolean,
};

const dbSchema = _.merge(
  baseSchema,
  {
    harvestMode: {allowedValues: ['allAtOnce', 'oneByOne']},
    regionIds: [String],
    enabled: {required: true, defaultValue: false},
  },
  metaSchema(),
);

export const Sources = new I18nCollection('sources');
Sources.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Sources.attachI18Schema(i18Schema);

registerHooks(Sources);