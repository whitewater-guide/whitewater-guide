import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import {formSchema} from '../../utils/SimpleSchemaUtils';
import {Regions} from '../regions';
import {Sections} from '../sections';

export const Rivers = new TAPi18n.Collection('rivers');

const RiversI18nSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

const RiversSchema = new SimpleSchema([
  RiversI18nSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    regionId: {
      type: String,
      label: 'Region',
      index: true,
    },
    createdAt: {
      type: Date,
      optional: true,
      autoValue: function() {
        return this.isSet ? undefined : new Date();
      }
    },
    createdBy: {
      type: String,
      optional: true,
      autoValue: function() {
        return this.isSet ? undefined : this.userId;
      }
    },
    updatedAt: {
      type: Date,
      autoValue: function() {
        return new Date();
      },
      optional: true
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }
]);

Rivers.attachSchema(RiversSchema);
Rivers.attachI18Schema(RiversI18nSchema);

export const createRiver = new AdminMethod({
  name: 'rivers.create',

  validate: formSchema(RiversSchema, '_id').validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data}) {
    return Rivers.insertTranslations(data);
  }
});

export const editRiver = new AdminMethod({
  name: 'rivers.edit',

  validate: formSchema(RiversSchema).validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...data}, language}) {
    return Rivers.updateTranslations(_id, {[language]: data});
  }
});

export const removeRiver = new AdminMethod({
  name: 'rivers.remove',

  validate: new SimpleSchema({
    _id: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({_id}) {
    return Rivers.remove(_id);
  },
});

Rivers.helpers({
  region(fields) {
    return Regions.find({_id: this.regionId}, {limit: 1, fields});
  },
  sections() {
    return Sections.find({riverId: this._id});
  },
});
