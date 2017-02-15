import {Regions} from '../regions';
import {Gauges} from '../gauges';
import {Sources} from './collection';
import {Roles} from 'meteor/alanning:roles';
import {launchScript} from '../scripts';
import {Jobs, generateSchedule} from '../jobs';
import _ from 'lodash';

const HarvestModes = {
  allAtOnce: 'ALL_AT_ONCE',
  oneByOne: 'ONE_BY_ONE',
};

const HarvestModesValues = _.invert(HarvestModes);

const publicFields = {
  script: 0,
  cron: 0,
  harvestMode: 0,
  enabled: 0,
};

function generateSourceSchedule(root, {_id}) {
  generateSchedule(_id);
  return true;
}

function setSourceEnabled(root, {_id, enabled}) {
  Sources.update({_id}, {$set: {enabled}});
  return Sources.findOne({_id});
}

function removeSource(root, {_id}) {
  return Sources.remove({_id}) > 0;
}

function autofillSource(root, {_id}) {
  const scriptName = Sources.findOne({_id}).script;
  console.log(`Launching autofill with script ${scriptName}`);
  return new Promise(
    (resolve, reject) => {
      launchScript(scriptName, 'autofill', (error, result) => {
        if (error)
          reject(error);
        else
          resolve(result);
      });
    }
  )
  .then(gauges => {
    console.log(`Found ${gauges.length} gauges`);
    gauges.forEach(gauge => Gauges.insertTranslations({sourceId: _id, ...gauge}));
    return true;
  })
}

function upsertSource(root, {source: {_id, ...source}, language}) {
  const hasJobs = !!_id && Jobs.find({
      "data.source": _id,
      status: {$in: ['running', 'ready', 'waiting', 'paused']}
    }).count() > 0;
  if (hasJobs)
    throw new Error('Cannot edit source which has running jobs');

  const data = {
    ...source,
    harvestMode: HarvestModesValues[source.harvestMode],
    regionIds: _.map(source.regions, '_id'),
  };

  if (_id)
    Sources.updateTranslations(_id, {[language]: data});
  else
    _id = Sources.insertTranslations(data);
  return Sources.findOne(_id);
}

export const sourcesResolvers = {
  Query: {
    sources: (root, args, context) => {
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      return Sources.find({}, {sort: {name: 1}, fields})
    },
    source: (root, {_id}, context) => {
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      return Sources.findOne({_id}, {fields});
    },
  },
  Mutation: {
    upsertSource,
    removeSource,
    setSourceEnabled,
    autofillSource,
    generateSourceSchedule,
  },
  Source: {
    regions: (source) => Regions.find({_id: {$in: source.regionIds}}),
    gauges: (source) => Gauges.find({sourceId: source._id}),
    harvestMode: source => HarvestModes[source.harvestMode],
  },
  WorkerScript: {
    harvestMode: source => HarvestModes[source.harvestMode],
  }
};