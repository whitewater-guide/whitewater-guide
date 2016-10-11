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

Sources.attachSchema(sourcesSchema);

export const createSource = new ValidatedMethod({
  name: 'sources.create',

  mixins: [CallPromiseMixin],

  validate: sourcesSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    console.log('Creating source');
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.create.unauthorized', 'You must be admin to create sources');
    }
    return Sources.insert(data);
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


export const startJobs = new ValidatedMethod({
  name: 'sources.startJobs',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.startJobs.unauthorized', 'Only admins can start jobs');
    }
    if (!this.isSimulation) {
      var serverSchedule = require('../jobs/server');
      serverSchedule.startJobs(sourceId);
    }
  },
});

export const removeJobs = new ValidatedMethod({
  name: 'sources.removeJobs',

  mixins: [CallPromiseMixin],

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
    if (!Roles.userIsInRole(this.userId, 'admin')){
      throw new Meteor.Error('sources.removeJobs.unauthorized', 'Only admins can remove jobs');
    }
    if (!this.isSimulation) {
      var serverSchedule = require('../jobs/server');
      serverSchedule.removeJobs(sourceId);
    }
  },
});

Sources.helpers({
  gauges() {
    return Gauges.find({ source: this._id });
  },
});

if (Meteor.isServer) {
  Sources.after.remove(function (sourceId, sourceDoc) {
    console.log(`Source ${sourceDoc.name} removed`);
    Gauges.remove({ source: sourceDoc._id });
    var serverSchedule = require('../jobs/server');
    serverSchedule.removeJobs(sourceId);
  });
}