import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {Gauges, createGauge} from '../gauges';
import { Roles } from 'meteor/alanning:roles';

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
  interval: {
    type: Number,
    label: 'Harvesting interval in minutes',
    min: 1,
    max: 2880, //2 days
    defaultValue: 60,
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
    //TODO: hook gauges removal
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

Sources.helpers({
  gauges(){
    return Gauges.find({source: this._id});
  },
})