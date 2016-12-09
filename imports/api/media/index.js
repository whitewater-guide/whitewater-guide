import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import AdminMethod from '../../utils/AdminMethod';

export const MediaI18nSchema = new SimpleSchema({
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

export const MediaSchema = new SimpleSchema([
  MediaI18nSchema,
  {
    url: {
      type: String,
      label: 'URL',
      regEx: SimpleSchema.RegEx.Url,
    },
    "type":{
      type: String,
      label: 'Type',
      allowedValues: ["photo","video","blog"],
    },
    description: {
      type: String,
      label: 'Description',
      optional: true,
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }
]);

const MediaSchemaWithId = new SimpleSchema([MediaSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]);

export const Media = new TAPi18n.Collection('media');
Media.attachSchema(MediaSchema);
Media.attachI18Schema(MediaI18nSchema);


export const createMedia = new AdminMethod({
  name: 'media.create',

  validate: MediaSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Media.insertTranslations(data);
  }
});

export const editMedia = new AdminMethod({
  name: 'media.edit',

  validate: new SimpleSchema({
    data: {
      type: MediaSchemaWithId,
    },
    language: {
      type: String,
      optional: true,
    }
  }).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...updates}, language}) {
    return Media.updateTranslations(_id, {[language]: updates});
  }
});