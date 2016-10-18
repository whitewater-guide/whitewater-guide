import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';

export const Regions = new Mongo.Collection('regions');

const regionsSchema = new SimpleSchema({
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

Regions.attachSchema(regionsSchema);

export const createRegion = new AdminMethod({
  name: 'regions.create',

  validate: regionsSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Regions.insert(data);
  }
});

export const editRegion = new AdminMethod({
  name: 'regions.edit',

  validate: new SimpleSchema([regionsSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
    return Regions.update(_id, { $set: {...data } } );
  }
});

export const removeRegion = new AdminMethod({
  name: 'regions.remove',

  validate: new SimpleSchema({
    regionId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({regionId}) {
    return Regions.remove(regionId);
  },
  
});