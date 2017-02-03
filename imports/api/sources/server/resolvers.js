import {Regions} from '../../regions';
import {Gauges} from '../../gauges';
import {Sources} from '../index';
import {Roles} from 'meteor/alanning:roles';

const HarvestModes = {
  allAtOnce: 'ALL_AT_ONCE',
  oneByOne: 'ONE_BY_ONE',
};

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
    }
  },
  Source: {
    regions: (source) => Regions.find({_id: {$in: source.regionIds}}),
    gauges: (source) => Gauges.find({sourceId: source._id}),
    harvestMode: source => HarvestModes[source.harvestMode],
  },
};