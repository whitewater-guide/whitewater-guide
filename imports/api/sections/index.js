import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Rivers } from '../rivers';
import { Gauges } from '../gauges';

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

const sectionsSchema = new SimpleSchema({
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
    label: 'Put-in coordinate',
    optional: true,
  },
  takeOut: {
    type: coordinateSchema,
    label: 'Take-out coordinate',//Some sections have multiple put-ins and take-outs
    optional: true,
  },
  length: {
    type: Number,
    label: 'Length, km',
    decimal: true,
    optional: true,
  },
  levels: {
    type: levelsSchema,
    label: 'Recommended water levels',
    optional: true,
  },
  difficulty: {
    type: Number,
    label: 'Section difficulty',//Might be level-dependant? How to describe IV+ (X)?
    decimal: true,
    min: 1,
    max: 6,
  },
  gradient: {
    type: Number,
    label: 'Gradient',
    decimal: true,
    optional: true,
  },
  season: {
    type: String,
    label: 'Season',//Makes sense to make this enum to enable filtering
    optional: true,
  },
  tags: {
    type: [String],
    label: 'Tags',
    defaultValue: [],
  },
  //Points of interest
  //Videos
  //Images
  //Blogs
  //Glacial-fed, etc
  //Creeking, boulder-garden-etc
  //Syphons, blockages, fishermen, etc?
});

Sections.attachSchema(sectionsSchema);

export const createSection = new AdminMethod({
  name: 'sections.create',

  validate: sectionsSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Sections.insert(data);
  }
});

export const editSection = new AdminMethod({
  name: 'sections.edit',

  validate: new SimpleSchema([sectionsSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
    return Sections.update(_id, { $set: {...data } } );
  }
});

export const removeSection = new AdminMethod({
  name: 'sections.remove',

  validate: new SimpleSchema({
    sectionId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({sectionId}) {
    return Sections.remove(sectionId);
  },

});


Sections.helpers({
  river: function(){
    return Rivers.findOne(this.riverId);
  },
  gauge: function () {
    return Gauges.findOne(this.gaugeId);
  },
});