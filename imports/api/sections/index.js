import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Regions } from '../regions';
import { Rivers } from '../rivers';

export const Sections = new Mongo.Collection('sections');

const coordinateSchema = new SimpleSchema({
  altitude: {
    type: Number,
    label: 'Altitude',
    decimal: true,
    optional: true,
  },
  latitude: {
    type: Number,
    label: 'Latitude',
    decimal: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    label: 'Longitude',
    decimal: true,
    min: -180,
    max: 180,
  },
});

const levelsSchema = new SimpleSchema({
  minimum: {
    type: Number,
    label: 'Minimum',
    decimal: true,
  },
  maximum: {
    type: Number,
    label: 'Maximum',
    decimal: true,
  },
  optimum: {
    type: Number,
    label: 'Optimum',
    decimal: true,
  },
});

const riversSchema = new SimpleSchema({
  riverId: {
    type: Meteor.ObjectID,
    label: 'River',
  },
  gaugeId: {
    type: Meteor.ObjectID,
    label: 'Gauge',
    optional: true,
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
  putIn: {
    type: coordinateSchema,
    description: 'Put-in coordinate',
    optional: true,
  },
  takeOut: {
    type: coordinateSchema,
    description: 'Take-out coordinate',//Some sections have multiple put-ins and take-outs
    optional: true,
  },
  length: {
    type: Number,
    description: 'Length, km',
    decimal: true,
    optional: true,
  },
  levels: {
    type: levelsSchema,
    description: 'Recommended water levels',
    optional: true,
  },
  grade: {
    type: Number,
    description: 'Section difficulty',//Might be level-dependant? How to describe IV+ (X)?
    decimal: true,
    min: 1,
    max: 6,
  },
  gradient: {
    type: Number,
    description: 'Gradient',
    decimal: true,
    optional: true,
  },
  season: {
    type: String,
    description: 'Season',//Makes sense to make this enum to enable filtering
    optional: true,
  },
  tags: {
    type: [String],
    description: 'Tags',
    optional: true,
  },
  //Glacial-fed, etc
  //Creeking, boulder-garden-etc
  //Syphons, blockages, fishermen, etc?
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
