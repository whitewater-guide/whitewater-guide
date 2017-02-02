import {Sources} from '../../sources';
import {Points} from '../../points';
import {Regions, createRegion, editRegion, removeRegion} from '../index';

export default {
  Query: {
    regions: (root, {language}) => Regions.find({}, {sort: {name: 1}, lang: language}),
    region: (root, {_id, language}) => Regions.findOne({_id}, {lang: language}),
  },
  Mutation: {
    createRegion: (root, {region}, context) => {
      //validator(region);
      const _id = createRegion._execute(context, {data: region});
      return Regions.findOne(_id);
    },
    editRegion: (root, {region, language}, context) => {
      editRegion._execute(context, {data: region, language});
      return Regions.findOne(region._id);
    },
    removeRegion: (root, data, context) => {
      removeRegion._execute(context, data);
      return true;
    }
  },
  Region: {
    seasonNumeric: region => region.seasonNumeric || [],
    sources(region){
      return Sources.find({regionIds: region._id});
    },
    pois(region){
      return Points.find({_id: {$in: region.poiIds}});
    }
  }
};