import {TAPi18n} from 'meteor/tap:i18n';
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Sources} from "../sources";
import AdminMethod from "../../utils/AdminMethod";
import {formSchema} from '../../utils/SimpleSchemaUtils';

export const Regions = new TAPi18n.Collection('regions');

const RegionsI18nSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 200,
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

const RegionsSchema = new SimpleSchema([
  RegionsI18nSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }
]);

Regions.attachSchema(RegionsSchema);

export const createRegion = new AdminMethod({
  name: 'regions.create',

  validate: formSchema(RegionsSchema, '_id').validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data}) {
    return Regions.insertTranslations(data);
  }
});

export const editRegion = new AdminMethod({
  name: 'regions.edit',

  validate: formSchema(RegionsSchema).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...data}, language}) {
    return Regions.updateTranslations(_id, {[language]: data});
  }
});

export const removeRegion = new AdminMethod({
  name: 'regions.remove',

  validate: new SimpleSchema({
    regionId: { type: String }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({regionId}) {
    return Regions.remove(regionId);
  },
  
});

Regions.helpers({
  sources(){
    return Sources.find({regionIds: this._id});
  },
});