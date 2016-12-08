import { TAPi18n } from 'meteor/tap:i18n';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Rivers } from '../rivers';
import { Gauges } from '../gauges';
import { LocationSchema } from "../Coordinates";
import { MediaSchema } from "../Media";

export const Sections = new TAPi18n.Collection('sections');

export const Durations = ['laps', 'twice', 'day-run', 'overnighter', 'multi-day'];

const levelsSchema = new SimpleSchema({
  minimum: {
    type: Number,
    label: 'Minimum',
    decimal: true,
    optional: true,
  },
  maximum: {
    type: Number,
    label: 'Maximum',
    decimal: true,
    optional: true,
  },
  optimum: {
    type: Number,
    label: 'Optimum',
    decimal: true,
    optional: true,
  },
  impossible: {
    type: Number,
    label: 'Absolute maximum',
    decimal: true,
    optional: true,
  }
});

export const sectionI18nSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
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

const sectionsSchema = new SimpleSchema([
  sectionI18nSchema,
  {
    riverId: {
      type: String,
      label: 'River',
    },
    gaugeId: {
      type: String,
      label: 'Gauge',
      optional: true,
    },
    putIn: {
      type: LocationSchema,
      label: 'Put-in location',
    },
    takeOut: {
      type: LocationSchema,
      label: 'Take-out location',
    },
    length: {
      type: Number,
      label: 'Length, km',
      decimal: true,
      optional: true,
    },
    duration: {
      type: String,
      label: 'Duration',
      optional: true,
      allowedValues: Durations,
    },
    levels: {
      type: levelsSchema,
      label: 'Recommended water levels',
      optional: true,
    },
    difficulty: {
      type: Number,
      label: 'Section difficulty',
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
    seasonNumeric: {
      type: [Number],
      label: 'Season (half-month)',
      min: 0,
      max: 23,
      optional: true,
      maxCount: 24,
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
    pointsOfInterest: {
      type: [LocationSchema],
      label: 'Points of interest',
      defaultValue: [],
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    // Not yet implemented
    // Can be implemented manually or wait until this feature comes with simple-schema 2.0
    // "i18n.$": {
    //   type: sectionI18nSchema,
    // },
  }
]);

const sectionsSchemaWithId = new SimpleSchema([sectionsSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]);

Sections.attachSchema(sectionsSchema);
Sections.attachI18Schema(sectionI18nSchema);

/**
 * Creates section, takes 1 argument - raw data object for new section
 * @type {AdminMethod}
 */
export const createSection = new AdminMethod({
  name: 'sections.create',

  validate: sectionsSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Sections.insertTranslations(data);
  }
});

export const editSection = new AdminMethod({
  name: 'sections.edit',

  validate: new SimpleSchema({
    data: {
      type: sectionsSchemaWithId,
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
    console.log('Edit section', _id, language, updates);
    if (language)
      return Sections.updateTranslations(_id, {[language]: updates});
    else
      return Sections.updateTranslations(_id, updates);
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