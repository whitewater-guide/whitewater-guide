import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {Gauges} from './gauges';

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
    max: 10,
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
    //Later add auth check here
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
    if (!this.isSimulation){
      return ServerScripts.listScripts();
    }
  },
});

Sources.helpers({
  gauges(){
    return Gauges.find({source: this._id});
  },
})