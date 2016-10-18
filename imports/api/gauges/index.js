import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import AdminMethod from '../../utils/AdminMethod';
import { Sources } from '../sources';
import { Measurements } from '../measurements';
import { Jobs } from '../jobs';
import cronParser from 'cron-parser';

export const Gauges = new Mongo.Collection('gauges');

const gaugesSchema = new SimpleSchema({
  source: {
    type: Meteor.ObjectID,
    label: 'Gauge source',
    index: true,
  },
  name: {
    type: String,
    label: 'Gauge name',
    max: 200,
  },
  code: {
    type: String,
    label: 'Unique code',
    max: 100,
    index: true,
  },
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
    optional: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    label: 'Longitude',
    decimal: true,
    optional: true,
    min: -180,
    max: 180,
  },
  unit: {
    type: String,
    defaultValue: 'cm',
    label: 'Measurement unit'
  },
  measurement: {
    type: String,
    defaultValue: 'Water level',
    label: 'Type of measurement',
  },
  requestParams: {
    type: Object,
    label: 'Additional API request parameters',
    optional: true,
  },
  cron: {
    type: String, 
    label: 'Cron expression',
    optional: true,
    custom: function () {
      if (this.value) {
        try {
          cronParser.parseExpression(this.value);
        }
        catch (e) {
          return 'notAllowed';
        }
      }
    },
  },
  lastTimestamp: {
    type: Date,
    label: 'Last measurement timestamp',
    optional: true,
  },
  lastValue: {
    type: Number,
    label: 'Last measured value',
    optional: true,
    decimal: true,
  },
  url: {
    type: String,
    label: 'URL',
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
});

//This prevents touching 'enabled' field in create/update methods
const enabledGaugesSchema = new SimpleSchema([gaugesSchema, { enabled: { type: Boolean, label: 'Enabled', defaultValue: false } }]);

Gauges.attachSchema(enabledGaugesSchema);

export const createGauge = new AdminMethod({
  name: 'gauges.create',

  validate: gaugesSchema.validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Gauges.insert(data);
  }
});

export const editGauge = new AdminMethod({
  name: 'gauges.edit',

  validate: new SimpleSchema([gaugesSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
    const current = Gauges.findOne(_id);
    const hasJobs = Jobs.find({ "data.gauge": _id, status: { $in: ['running', 'ready', 'waiting', 'paused'] } }).count() > 0;
    //Cannot change harvest settings for already running script
    if (hasJobs && (data.cron !== current.cron)) {
      throw new Meteor.Error('gauges.edit.jobsRunning', 'Cannot edit gauge which has running jobs');
    }
    return Gauges.update(_id, { $set: {...data } } );
  }
});

export const setEnabled = new AdminMethod({
  name: 'gauges.setEnabled',

  validate: new SimpleSchema({
    gaugeId: { type: String, regEx: SimpleSchema.RegEx.Id },
    enabled: { type: Boolean },
  }).validator(),

  run({gaugeId, enabled}) {
    //Server hook is used to start/stop jobs
    return Gauges.update(gaugeId, { $set: { enabled } } );
  }

});

export const enableAll = new AdminMethod({
  name: 'gauges.enableAll',

  validate: new SimpleSchema({
    sourceId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),

  run({sourceId}) {
    //Server hook is used to start/stop jobs
    return Gauges.update({ source: sourceId, enabled: false }, { $set: { enabled: true } }, { multi: true });
  }
});

export const removeGauge = new AdminMethod({
  name: 'gauges.remove',

  validate: new SimpleSchema({
    gaugeId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({gaugeId}) {
    return Gauges.remove(gaugeId);
  },
  
});


export const removeAllGauges = new AdminMethod({
  name: 'gauges.removeAll',

  validate: new SimpleSchema({
    sourceId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({sourceId}) {
    return Gauges.remove({source: sourceId});
  },
  
});

export const removeDisabledGauges = new AdminMethod({
  name: 'gauges.removeDisabled',

  validate: new SimpleSchema({
    sourceId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({sourceId}) {
    return Gauges.remove({source: sourceId, enabled: false});
  },
  
});

Gauges.helpers({
  source(){
    return Sources.findOne(this.source);
  },
  measurements() {
    return Measurements.find({ gauge: this._id });
  }
});