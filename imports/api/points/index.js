import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {TAPi18n} from 'meteor/tap:i18n';
import AdminMethod from '../../utils/AdminMethod';
import {formSchema} from "../../utils/SimpleSchemaUtils";

const limits = [
  {min: -90, max: 90, msg: 'lonOutOfRange'},
  {min: -180, max: 180, msg: 'latOutOfRange'},
];

export const POITypes = [
  'put-in',
  'put-in-alt',
  'take-out',
  'take-out-alt',
  'waterfall',
  'rapid',
  'portage',
  'playspot',
  'hazard',
  'river-campsite',
  'wild-camping',
  'paid-camping',
  'gauge',
  'other',
];

export const PointI18nSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

//When Point is a type of nested OPTIONAL document, and this Point field is not specified,
//defaultValue on type and kind will generated bad Point without coordinates
//So owner will fail validation of this optional Point
//This is a workaround - if Point is truly unspecified, it won't generate default object
function getAutoValue(value){
  return function autoValue(){
    let isSet = ['coordinate', 'altitude', 'kind', 'type'].some(sibling => this.siblingField(sibling).isSet);
    if (this.operator === null && isSet && !this.isSet)
      return value;
  }
}

export const PointSchema = new SimpleSchema([
  PointI18nSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    "type": {
      type: String,
      allowedValues: ['Point'],
      autoValue: getAutoValue('Point'),
      optional: true,
    },
    coordinates: {
      type: [Number],
      label: 'Longitude & Latitude',
      decimal: true,
      minCount: 2,
      maxCount: 2,
    },
    "coordinates.$": {
      custom: function () {
        const index = Number(this.key.match(/\d+/)[0]);
        const limit = limits[index];
        if (this.value === null || this.value === undefined)
          return 'required';
        if (this.value >= limit.max || this.value <= limit.min)
          return limit.msg;
      },
    },
    altitude: {
      type: Number,
      label: 'Altitude',
      decimal: true,
      optional: true,
    },
    kind: {
      type: String,
      label: 'Type of point',
      autoValue: getAutoValue('other'),
      allowedValues: POITypes,
      optional: true,
    },
    i18n: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }
]);

PointSchema.messages = {
  lonOutOfRange: 'Longitude out of range', // Must be between -90 and 90
  latOutOfRange: 'Latitude out of range' // Must be between -180 and 180
};

export const Points = new TAPi18n.Collection('points');

Points.attachSchema(PointSchema);
Points.attachI18Schema(PointI18nSchema);

export const upsertPoint = new AdminMethod({
  name: 'points.upsert',

  validate: formSchema(PointSchema).validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...updates}, language}) {
    language = language || Points._base_language;
    const {insertedId} = Points.upsertTranslations(_id, {[language]: updates});
    return {_id: insertedId || _id, ...updates};
  }
});
