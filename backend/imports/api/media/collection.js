import SimpleSchema from 'simpl-schema';
import {I18nCollection} from '../../i18n';
import {metaSchema} from '../../utils/SimpleSchemaUtils';
import _ from 'lodash';
import {registerHooks} from "./hooks";

const i18Schema = {
  description: String,
  copyright: String,
};

const baseSchema = {
  ...i18Schema,
  _id: {type: String, regEx: SimpleSchema.RegEx.Id},
  url: {type: String},
  type: {type: String, allowedValues: ["photo", "video", "blog"]},
  width: Number,
  height: Number,
};

const dbSchema = _.merge(
  baseSchema,
  {
    url: {required: true},
    type: {required: true},
  },
  metaSchema(),
);

export const Media = new I18nCollection('media');
Media.attachSchema(new SimpleSchema(dbSchema, {requiredByDefault: false}));
Media.attachI18Schema(i18Schema);

registerHooks(Media);