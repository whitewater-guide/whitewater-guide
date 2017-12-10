import {Regions} from '../regions';
import {Gauges, upsertGauge} from '../gauges';
import {Sources} from './collection';
import {launchScript} from '../scripts';
import {generateSchedule} from '../jobs';
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
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }
  )
  .then(gauges => {
    console.log(`Found ${gauges.length} gauges`);
    gauges.forEach(gauge => {
      try {
        upsertGauge({ gauge: { sourceId: _id, ...gauge } })
      } catch (err) {
        console.error('Failed to upsert gauge while autofilling source:', gauge);
      }
    });
    return true;
  })
  .catch(error => console.error(`Script ${scriptName} autofill error:`, error));
}

function upsertSource(root, {source: {_id, ...source}, language}) {

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
      const fields = context.isAdmin ? undefined : publicFields;
      return Sources.find({}, {sort: {name: 1}, fields})
    },
    source: (root, {_id}, context) => {
      const fields = context.isAdmin ? undefined : publicFields;
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