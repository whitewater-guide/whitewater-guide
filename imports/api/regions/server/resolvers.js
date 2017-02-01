import {Sources} from '../../sources';
import {Points} from '../../points';
import {Regions, createRegion, editRegion, removeRegion} from '../index';

export default {
  Query: {
    regions: () => Regions.find({}, {sort: {name: 1}}).fetch(),
    region: (root, _id) => Regions.findOne({_id}),
  },
  Mutation: {
    createRegion: (root, {region}, context) => {
      //validator(region);
      const _id = createRegion._execute(context, {data: {...region}});
      return Regions.findOne(_id);
    },
    editRegion: (root, {region}, context, info) => {
      const _id = editRegion.call({data: region});
      return Regions.findOne(_id);
    },
    removeRegion: (root, data, context) => {
      removeRegion._execute(context, {...data});
      return true;
    }
  },
  Region: {
    sources(region){
      return Sources.find({regionIds: region._id}).fetch();
    },
    pois(region){
      return Points.find({_id: {$in: region.poiIds}}).fetch();
    }
  }
};