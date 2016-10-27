import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Gauges, createGauge } from '../gauges';
import { Jobs } from '../jobs';
import AdminMethod from '../../utils/AdminMethod';
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
  regions: {
    type: [Meteor.ObjectID],
    label: 'Regions',
    defaultValue: [],
  },
});

const enabledSourcesSchema = new SimpleSchema([sourcesSchema, { enabled: { type: Boolean, label: 'Enabled', defaultValue: false } }]);

Sources.attachSchema(enabledSourcesSchema);

export const createSource = new AdminMethod({
  name: 'sources.create',

  validate: sourcesSchema.validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run(data) {
    return Sources.insert(data);
  }
});

export const editSource = new AdminMethod({
  name: 'sources.edit',

  validate: new SimpleSchema([sourcesSchema, { _id: { type: String, regEx: SimpleSchema.RegEx.Id } }]).validator({ clean: true }),

  applyOptions: {
    noRetry: true,
  },

  run({_id, ...data}) {
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

export const removeSource = new AdminMethod({
  name: 'sources.remove',

  validate: new SimpleSchema({
    sourceId: { type: Meteor.ObjectID }
  }).validator(),

  applyOptions: {
    noRetry: true,
  },
  
  run({sourceId}) {
    //Gauges and jobs are removed in server hook
    return Sources.remove(sourceId);
  },
  
});

export const listScripts = new AdminMethod({
  name: 'sources.listScripts',

  validate: null,

  applyOptions: {
    returnStubValue: false,
  },
  
  run() {
    if (!this.isSimulation){
      return ServerScripts.listScripts();
    }
  },
});

export const autofill = new AdminMethod({
  name: 'sources.autofill',

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
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

export const generateSchedule = new AdminMethod({
  name: 'sources.generateSchedule',

  validate: new SimpleSchema({
    sourceId: { type: String }
  }).validator(),

  applyOptions: {
    returnStubValue: false,
  },
  
  run({sourceId}) {
    if (!this.isSimulation) {
      var serverSchedule = require('../jobs/server');
      serverSchedule.generateSchedule(sourceId);
    }
  },
});

export const setEnabled = new AdminMethod({
  name: 'sources.setEnabled',

  validate: new SimpleSchema({
    sourceId: { type: String, regEx: SimpleSchema.RegEx.Id },
    enabled: { type: Boolean },
  }).validator(),

  run({sourceId, enabled}) {
    //Server hook is used to start/stop jobs
    Sources.update(sourceId, { $set: { enabled } });
  },
});

Sources.helpers({
  gauges() {
    return Gauges.find({ source: this._id });
  },
});
