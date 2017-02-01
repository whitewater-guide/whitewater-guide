import {Regions} from '../../regions';
import {Sources} from '../index';

const HarvestModes = {
  allAtOnce: 'ALL_AT_ONCE',
  oneByObe: 'ONE_BY_ONE',
};


export default {
  Query: {
    sources: () => Sources.find({}, {sort: {name: 1}}).fetch(),
    source: (root, {_id}) => Sources.findOne({_id}),
  },
  Source: {
    regions: (source) => Regions.find({_id: {$in: source.regionIds}}).fetch(),
    harvestMode: source => HarvestModes[source.harvestMode],
  },
};