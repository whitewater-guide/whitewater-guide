import {Sources} from '../sources';
import {Points} from '../points';
import {Rivers} from '../rivers';
import {Regions} from './collection';
import {upsertChildren} from '../../utils/CollectionUtils';

function upsertRegion(root, data) {
  let {region: {_id, pois, ...region}, language} = data;
  const poiIds = upsertChildren(Points, pois, language);
  if (_id)
    Regions.updateTranslations(_id, {[language]: {poiIds, ...region}});
  else
    _id = Regions.insertTranslations({poiIds, ...region});
  return Regions.findOne(_id);
}

function removeRegion(root, {_id}) {
  return Regions.remove(_id) > 0;
}

export const regionsResolvers = {
  Query: {
    regions: (root, {language}) => Regions.find({}, {sort: {name: 1}, lang: language}),
    region: (root, {_id, language}) => Regions.findOne({_id}, {lang: language}),
  },
  Mutation: {
    upsertRegion,
    removeRegion,
  },
  Region: {
    seasonNumeric: region => region.seasonNumeric || [],
    sources: region => Sources.find({regionIds: region._id}),
    pois: region => Points.find({_id: {$in: region.poiIds}}),
    rivers: region => Rivers.find({regionId: region._id}),
  }
};