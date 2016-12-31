import {TAPi18n} from 'meteor/tap:i18n';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import {Rivers} from '../rivers';
import {Gauges} from '../gauges';
import {Points, PointSchema} from '../points';
import {Media, MediaSchema} from '../media';
import _ from 'lodash';

export const Sections = new TAPi18n.Collection('sections');

export const Durations = ['laps', 'twice', 'day-run', 'overnighter', 'multi-day'];

const LevelsSchema = new SimpleSchema({
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
  },
  approximate: {
    type: Boolean,
    label: 'Is approximate',
    optional: true,
  },
});

export const SectionI18nSchema = new SimpleSchema({
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

const SectionBaseSchema = new SimpleSchema({
  riverId: {
    type: String,
    label: 'River',
  },
  gaugeId: {
    type: String,
    label: 'Gauge',
    optional: true,
  },
  distance: {
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
    type: LevelsSchema,
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
  rating: {
    type: Number,
    label: 'Rating',
    decimal: true,
    min: 0,
    max: 5,
    defaultValue: 0,
  },
  difficultyXtra: {
    type: String,
    label: 'Additional difficulty',
    optional: true,
    max: 6,
  },
  drop: {
    type: Number,
    label: 'Drop, in meters',
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
    defaultValue: [],
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
  i18n: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Not yet implemented
  // Can be implemented manually or wait until this feature comes with simple-schema 2.0
  // "i18n.$": {
  //   type: SectionI18nSchema,
  // },
});

const SectionRefsSchema = new SimpleSchema({
  putInId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Put-in location',
  },
  takeOutId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Take-out location',
  },
  mediaIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    label: "Media",
    defaultValue: [],
  },
  poiIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    label: 'Points of interest',
    defaultValue: [],
  },
});

const SectionsSchema = new SimpleSchema([
  SectionBaseSchema,
  SectionI18nSchema,
  SectionRefsSchema,
]);

const SectionsCrudSchema = new SimpleSchema({
  data: {
    type: new SimpleSchema([
      SectionBaseSchema,
      SectionI18nSchema,
      {
        _id: {
          type: String,
          regEx: SimpleSchema.RegEx.Id,
          optional: true
        },
        media: {
          type: [new SimpleSchema([MediaSchema, {_id: {type:String, optional: true}, deleted: {type: Boolean, optional: true}}])],
          defaultValue: [],
        },
        pois: {
          type: [new SimpleSchema([PointSchema, {_id: {type:String, optional: true}, deleted: {type: Boolean, optional: true}}])],
          defaultValue: [],
        },
        putIn: {
          type: PointSchema,
          optional: true,
        },
        takeOut: {
          type: PointSchema,
          optional: true,
        },
      },
    ]),
  },
  language: {
    type: String,
    optional: true,
  }
});

Sections.attachSchema(SectionsSchema);
Sections.attachI18Schema(SectionI18nSchema);

export const upsertSection = new AdminMethod({
  name: 'sections.upsert',

  validate: SectionsCrudSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, media, pois, putIn, takeOut, ...updates}, language}) {
    language = language || Sections._base_language;
    //First, handle media attachments
    const mediaIds = _.chain(media)
      .map(mediaItem => {
        if (mediaItem.deleted)
          return null;
        delete mediaItem.deleted;//Do not need to store this in mongo
        const mediaItemId = mediaItem._id;
        delete mediaItem._id;
        const {insertedId} = Media.upsertTranslations(mediaItemId, {[language]: mediaItem});
        return mediaItemId || insertedId;
      })
      .compact()
      .value();
    const poiIds = _.chain(pois)
      .map(poiItem => {
        if (poiItem.deleted)
          return null;
        delete poiItem.deleted;//Do not need to store this in mongo
        const poiItemId = poiItem._id;
        delete poiItem._id;
        const {insertedId} = Points.upsertTranslations(poiItemId, {[language]: poiItem});
        return poiItemId || insertedId;
      })
      .compact()
      .value();
    let {_id: putInId, ...putInData} = putIn;
    let putInResult = Points.upsertTranslations(putInId, {[language]: {...putInData, kind: 'put-in'}});
    putInId = putInId || putInResult.insertedId;
    let {_id: takeOutId, ...takeOutData} = takeOut;
    let takeOutResult = Points.upsertTranslations(takeOutId, {[language]: {...takeOutData, kind: 'take-out'}});
    takeOutId = takeOutId || takeOutResult.insertedId;

    updates = {...updates, mediaIds, poiIds, putInId, takeOutId};
    return Sections.upsertTranslations(_id, {[language]: updates});
  }
});



export const removeSection = new AdminMethod({
  name: 'sections.remove',

  validate: new SimpleSchema({
    sectionId: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({sectionId}) {
    return Sections.remove(sectionId);
  },

});

Sections.helpers({
  river: function () {
    return Rivers.find(this.riverId, {limit: 1});
  },
  gauge: function () {
    return Gauges.find(this.gaugeId, {limit: 1});
  },
  putIn: function () {
    return Points.find(this.putInId, {limit: 1});
  },
  takeOut: function () {
    return Points.find(this.takeOutId, {limit: 1});
  },
  media: function () {
    return Media.find({_id: {$in: this.mediaIds}});
  },
  pois: function () {
    return Points.find({_id: {$in: this.poiIds}});
  },
});