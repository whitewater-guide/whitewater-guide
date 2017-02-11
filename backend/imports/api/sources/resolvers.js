import {Regions} from '../regions';
import {Gauges} from '../gauges';
import {Sources, createSource, editSource, removeSource, setEnabled, autofill, generateSchedule} from './index';
import {Roles} from 'meteor/alanning:roles';
import {listScripts} from '../scripts';
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

export default {
  Query: {
    sources: (root, args, context) => {
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      return Sources.find({}, {sort: {name: 1}, fields})
    },
    source: (root, {_id}, context) => {
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      return Sources.findOne({_id}, {fields});
    },
    listScripts: () => listScripts(),
  },
  Mutation: {
    upsertSource: (root, {source, language}, context) => {
      const data = {
        ...source,
        harvestMode: HarvestModesValues[source.harvestMode],
        regionIds: source.regions.map(region => region._id),
      };
      let _id = source._id;
      if (_id)
        editSource._execute(context, {data, language});
      else
        _id = createSource._execute(context, {data, language});
      return Sources.findOne(_id);
    },
    removeSource: (root, data, context) => {
      removeSource._execute(context, data);
      return true;
    },
    setSourceEnabled: (root, data, context) => {
      setEnabled._execute(context, data);
      return Sources.findOne(data.sourceId);
    },
    autofillSource: (root, data, context) => {
      autofill._execute(context, data);
      return true;
    },
    generateSourceSchedule: (root, data, context) => {
      generateSchedule._execute(context, data);
      return true;
    },
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