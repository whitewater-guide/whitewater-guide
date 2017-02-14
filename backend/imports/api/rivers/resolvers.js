import {Rivers} from './collection';
import {Regions} from '../regions';
import {Sections} from '../sections';
import {pickFromSelf} from '../../utils/ApolloUtils';
import _ from 'lodash';

function upsertRiver(root, data){
  let {river: {_id, ...river}, language} = data;
  if (_id)
    Rivers.updateTranslations(_id, {[language]: river});
  else
    _id = Rivers.insertTranslations(data);
  return Rivers.findOne(_id);
}

function removeRiver(root, {_id}){
  return Rivers.remove(_id) > 0;
}

export const riversResolvers = {
  Query: {
    rivers: (root, {regionId, language, skip = 0, limit = 10}) => {
      limit = _.clamp(limit, 10, 100);
      const query = _.pickBy({regionId});
      return Rivers.find(query, {sort: {name: 1}, lang: language, skip, limit})
    },
    river: (root, {_id, language}) => Rivers.findOne({_id}, {lang: language}),
    countRivers: (root, query) => Rivers.find(query).count(),
  },
  Mutation: {
    upsertRiver,
    removeRiver,
  },
  River: {
    region: (river, data, context, info) => {
      const simpleResult = pickFromSelf(river, context, info, {_id: 'regionId'});
      return simpleResult || river.regionId && Regions.findOne(river.regionId);
    },
    sections: (river) => Sections.find({riverId: river._id}),
  }
};