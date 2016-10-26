import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Regions } from '../regions';

export const Rivers = new Mongo.Collection('rivers');

const riversSchema = new SimpleSchema({
  regionId: {
    type: Meteor.ObjectID,
    label: 'Region',
    index: true,
  },
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

Rivers.attachSchema(riversSchema);

export const createRiver = new AdminMethod({
  name: 'rivers.create',

  validate: riversSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Rivers.insert(data);
  }
});

export const editRiver = new AdminMethod({
  name: 'rivers.edit',

  validate: new SimpleSchema([riversSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
    return Rivers.update(_id, { $set: {...data } } );
  }
});

export const removeRiver = new AdminMethod({
  name: 'rivers.remove',

  validate: new SimpleSchema({
    riverId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({riverId}) {
    return Rivers.remove(riverId);
  },
  
});

Rivers.helpers({
  region: function() {
    return Regions.findOne(this.regionId);
  }
});
