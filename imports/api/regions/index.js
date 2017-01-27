import {TAPi18n} from 'meteor/tap:i18n';
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Sources} from "../sources";
import {Points, PointSchema} from "../points";
import AdminMethod from "../../utils/AdminMethod";
import {formSchema} from '../../utils/SimpleSchemaUtils';
import _ from 'lodash';

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
  season: {
    type: String,
    label: 'Season',
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
    seasonNumeric: {
      type: [Number],
      label: 'Season (half-month)',
      min: 0,
      max: 23,
      optional: true,
      maxCount: 24,
      defaultValue: [],
    },
    poiIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      label: 'Points of interest',
      defaultValue: [],
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }
]);

const RegionsCrudSchema = new SimpleSchema([
  RegionsSchema,
  {
    pois: {
      type: [new SimpleSchema([PointSchema, {_id: {type:String, optional: true}, deleted: {type: Boolean, optional: true}}])],
      defaultValue: [],
    },
  },
]);

Regions.attachSchema(RegionsSchema);
Regions.attachI18Schema(RegionsI18nSchema);

export const createRegion = new AdminMethod({
  name: 'regions.create',

  validate: formSchema(RegionsCrudSchema, '_id', 'poiIds').validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data, language}) {
    const updates = prepareUpdates(data, language);
    return Regions.insertTranslations(updates);
  }
});

export const editRegion = new AdminMethod({
  name: 'regions.edit',

  validate: formSchema(RegionsCrudSchema, 'poiIds').validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...data}, language}) {
    const updates = prepareUpdates(data, language);
    return Regions.updateTranslations(_id, {[language]: updates});
  }
});

function prepareUpdates({pois, ...data}, language){
  const poiIds = _.chain(pois)
    .map(poiItem => {
      if (poiItem.deleted) {
        Points.remove({_id: poiItem._id});
        return null;
      }
      delete poiItem.deleted;//Do not need to store this in mongo
      const poiItemId = poiItem._id;
      delete poiItem._id;
      const {insertedId} = Points.upsertTranslations(poiItemId, {[language]: poiItem});
      return poiItemId || insertedId;
    })
    .compact()
    .value();
  return {...data, poiIds};
}

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
  pois: function () {
    return Points.find({_id: {$in: this.poiIds}});
  },
});