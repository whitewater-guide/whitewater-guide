import {TAPi18n} from 'meteor/tap:i18n';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import {Rivers} from '../rivers';
import {Gauges} from '../gauges';
import {Points, PointSchema} from '../points';
import {Media, MediaSchema} from '../media';
import _ from 'lodash';

export const Sections = new TAPi18n.Collection('sections');

export const Durations = [
  {value: 0, slug: 'laps'},
  {value: 10, slug: 'twice'},
  {value: 20, slug: 'day-run'},
  {value: 30, slug: 'overnighter'},
  {value: 40, slug: 'multi-day'},
];

const GaugeBindingSchema = new SimpleSchema({
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
  lastTimestamp: {//Hooked to measurements insert
    type: Date,
    label: 'Last measurement date',
    optional: true,
  },
  lastValue: {//Hooked to measurements insert
    type: Number,
    label: 'Last measured value',
    decimal: true,
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
  riverName: {//Denormalized
    type: String,
    label: 'River name',
    optional: true,
  },
});

const SectionBaseSchema = new SimpleSchema({
  riverId: {
    type: String,
    label: 'River',
  },
  regionId: {//Denormalized on create/update
    type: String,
    label: 'Region',
    optional: true,
  },
  gaugeId: {
    type: String,
    label: 'Gauge',
    optional: true,
  },
  putIn: {//Denormalized
    type: PointSchema,
    label: 'Put-in point',
  },
  takeOut: {
    type: PointSchema,
    label: 'Take-out point',
  },
  distance: {
    type: Number,
    label: 'Length, km',
    decimal: true,
    optional: true,
  },
  duration: {
    type: Number,
    label: 'Duration',
    optional: true,
    allowedValues: _.map(Durations, 'value'),
  },
  levels: {
    type: GaugeBindingSchema,
    label: 'Recommended water levels',
    optional: true,
  },
  flows: {
    type: GaugeBindingSchema,
    label: 'Recommended water flows',
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
  // Not yet implemented
  // Can be implemented manually or wait until this feature comes with simple-schema 2.0
  // "i18n.$": {
  //   type: SectionI18nSchema,
  // },
});

const SectionRefsSchema = new SimpleSchema({
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

export const createSection = new AdminMethod({
  name: 'sections.create',

  validate: SectionsCrudSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data, language}) {
    const updates = prepareUpdates(data, language);
    return Sections.insertTranslations(updates);
  }
});

export const editSection = new AdminMethod({
  name: 'sections.edit',

  validate: SectionsCrudSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...data}, language}) {
    const updates = prepareUpdates(data, language);
    return Sections.updateTranslations(_id, {[language]: updates});
  }
});

function prepareUpdates({media, pois, ...data}, language){
  language = language || Sections._base_language;
  const mediaIds = _.chain(media)
    .map(mediaItem => {
      if (mediaItem.deleted) {
        Media.remove({_id: mediaItem._id});
        return null;
      }
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
  let {_id: putInId, ...putInData} = data.putIn;
  let putInResult = Points.upsertTranslations(putInId, {[language]: {...putInData, kind: 'put-in'}});
  putInId = putInId || putInResult.insertedId;
  let {_id: takeOutId, ...takeOutData} = data.takeOut;
  let takeOutResult = Points.upsertTranslations(takeOutId, {[language]: {...takeOutData, kind: 'take-out'}});
  takeOutId = takeOutId || takeOutResult.insertedId;

  let updates = {...data, mediaIds, poiIds, putIn: {_id: putInId, ...putInData}, takeOut: {_id: takeOutId, ...takeOutData}};

  const river = Rivers.findOne({_id: data.riverId}, {fields: {regionId: 1, name: 1}});
  if (river) {
    updates.regionId = river.regionId;
    updates.riverName = river.name;
  }

  return updates;
}

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
  media: function () {
    return Media.find({_id: {$in: this.mediaIds}});
  },
  pois: function () {
    return Points.find({_id: {$in: this.poiIds}});
  },
});