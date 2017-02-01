import {Sources} from '../../sources';
import {Points} from '../../points';
import {Regions} from '../index';

export default {
  Query: {
    regions: () => Regions.find({}, {sort: {name: 1}}).fetch(),
    region: (root, _id) => Regions.findOne({_id}),
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