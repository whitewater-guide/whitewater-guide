import {Sources} from '../../sources';
import {Points} from '../../points';
import {Rivers} from '../../rivers';
import {Regions, createRegion, editRegion, removeRegion} from '../index';

export default {
  Query: {
    regions: (root, {language}) => Regions.find({}, {sort: {name: 1}, lang: language}),
    region: (root, {_id, language}) => Regions.findOne({_id}, {lang: language}),
  },
  Mutation: {
    upsertRegion: (root, {region, language}, context) => {
      let _id = region._id;
      if (_id)
        editRegion._execute(context, {data: region, language});
      else
        _id = createRegion._execute(context, {data: region, language});
      return Regions.findOne(_id);
    },
    removeRegion: (root, data, context) => {
      removeRegion._execute(context, data);
      return true;
    }
  },
  Region: {
    seasonNumeric: region => region.seasonNumeric || [],
    sources: region => Sources.find({regionIds: region._id}),
    pois: region => Points.find({_id: {$in: region.poiIds}}),
    rivers: region => Rivers.find({regionId: region._id}),
  }
};