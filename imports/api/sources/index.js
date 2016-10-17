import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import { Gauges, createGauge } from '../gauges';
import { Jobs } from '../jobs';
import { Roles } from 'meteor/alanning:roles';
import cronParser from 'cron-parser';

export const Sources = new Mongo.Collection('sources');

const sourcesSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Data source',
    min: 3,
    max: 100,
  },
  script: {
    type: String,
    label: 'Script name',
    min: 3,
    max: 20,
  },
  cron: {
    type: String, 
    label: 'Cron expression',
    optional: true,
    custom: function () {
      try {
        cronParser.parseExpression(this.value);
      }
      catch (e) {
        return 'notAllowed';
      }
    },
  },
  harvestMode: {
    type: String,
    label: 'Harvest mode',
    allowedValues: ['allAtOnce', 'oneByOne'],
    defaultValue: 'allAtOnce',
  },
  url: {
    type: String,
    label: 'URL',
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
});

const enabledSourcesSchema = new SimpleSchema([sourcesSchema, { enabled: { type: Boolean, label: 'Enabled', defaultValue: false } }]);

Sources.attachSchema(enabledSourcesSchema);

export const createSource = new ValidatedMethod({
  name: 'sources.create',

  mixins: [CallPromiseMixin],

  validate: sourcesSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    console.log('Creating source');
    //TODO: use permissions mixin https://atmospherejs.com/didericis/permissions-mixin
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.create.unauthorized', 'You must be admin to create sources');
    }
    return Sources.insert(data);
  }
});

export const editSource = new ValidatedMethod({
  name: 'sources.edit',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema([sourcesSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.edit.unauthorized', 'You must be admin to edit sources');
    }
    const current = Sources.findOne(_id);
    const hasJobs = Jobs.find({ "data.source": _id, status: { $in: ['running', 'ready', 'waiting', 'paused'] } }).count() > 0;
    console.log('Editing source', JSON.stringify(data), JSON.stringify(current));
    //Cannot change harvest settings for already running script
    if (hasJobs && (data.script !== current.script || data.harvestMode !== current.harvestMode || data.cron !== current.cron)) {
      throw new Meteor.Error('sources.edit.jobsRunning', 'Cannot edit source which has running jobs');
    }
    return Sources.update(_id, { $set: {...data } } );
  }
});

export const removeSource = new ValidatedMethod({
  name: 'sources.remove',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({sourceId}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.remove.unauthorized', 'You must be admin to remove sources');
    }
    //Gauges and jobs are removed in server hook
    return Sources.remove(sourceId);
  },
  
});

export const listScripts = new ValidatedMethod({
  name: 'sources.listScripts',

  mixins: [CallPromiseMixin],

  validate: null,

  applyOptions: {
    returnStubValue: false,
  },
  
  run() {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.listScripts.unauthorized', 'Only admins can see sources scripts');
    }
    if (!this.isSimulation){
      return ServerScripts.listScripts();
    }
  },
});

export const autofill = new ValidatedMethod({
  name: 'sources.autofill',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.autofill.unauthorized', 'Only admins can autofill sources');
    }
    if (!this.isSimulation){
      const scriptName = Sources.findOne(sourceId).script;
      console.log(`Launching autofill with script ${scriptName}`);
      const launchScriptFiber = Meteor.wrapAsync(ServerScripts.launchScript);
      const gauges = launchScriptFiber(scriptName, 'autofill');
      console.log(`Found ${gauges.length} gauges`);
      gauges.forEach(gauge => {
        createGauge.call({source: sourceId, ...gauge});
      });
    }
  },
});

export const generateSchedule = new ValidatedMethod({
  name: 'sources.generateSchedule',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.generateSchedule.unauthorized', 'Only admins can autofill sources');
    }
    if (!this.isSimulation) {
      var serverSchedule = require('../jobs/server');
      serverSchedule.generateSchedule(sourceId);
    }
  },
});

export const setEnabled = new ValidatedMethod({
  name: 'sources.setEnabled',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    enabled: { type: Boolean },
  }).validator(),

  run({sourceId, enabled}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.setEnabled.unauthorized', 'Only admins can enable/disable sources');
    }
    //Server hook is used to start/stop jobs
    Sources.update(sourceId, { $set: { enabled } });
  },
});

Sources.helpers({
  gauges() {
    return Gauges.find({ source: this._id });
  },
});
