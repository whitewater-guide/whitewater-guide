import SimpleSchema from 'simpl-schema';
import {metaSchema} from '../../utils/SimpleSchemaUtils';
import {I18nCollection} from '../../i18n';
import _ from 'lodash';
import {registerHooks} from "./hooks";

const i18Schema = {
  name: String,
  description: String,
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  regionId: {type: String, regEx: SimpleSchema.RegEx.Id},
};

const dbSchema = _.merge(
  baseSchema,
  {
    name: {required: true, index: true},
    regionId: {required: true, index: true},
  },
  metaSchema(),
);

export const Rivers = new I18nCollection('rivers');
Rivers.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Rivers.attachI18Schema(i18Schema);

registerHooks(Rivers);