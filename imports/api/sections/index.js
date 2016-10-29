import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Rivers } from '../rivers';
import { Gauges } from '../gauges';
import { LocationSchema } from "../Coordinates";
import { MediaSchema } from "../Media";

export const Sections = new Mongo.Collection('sections');

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
    type: String,
    label: 'River',
  },
  gaugeId: {
    type: String,
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
    type: LocationSchema,
    label: 'Put-in location',
    optional: true,
  },
  takeOut: {
    type: LocationSchema,
    label: 'Take-out location',//Some sections have multiple put-ins and take-outs
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
  supplyTagIds: {//Misc tags
    type: [String],
    label: 'River supply types',
    defaultValue: [],
  },
  kayakingTagIds: {//Misc tags
    type: [String],
    label: 'Kayaking types',
    defaultValue: [],
  },
  hazardsTagIds: {//Misc tags
    type: [String],
    label: 'Hazards',
    defaultValue: [],
  },
  miscTagIds: {//Misc tags
    type: [String],
    label: 'Tags',
    defaultValue: [],
  },
  media: {
    type: [MediaSchema],
    label: "Media",
    defaultValue: [],
  },
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
    sectionId: { type: String }
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