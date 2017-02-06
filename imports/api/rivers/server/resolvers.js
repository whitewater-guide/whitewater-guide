import {Rivers, createRiver, editRiver, removeRiver} from '../index';
import getFieldNames from '../../../graphql-list-fields';
import {Regions} from '../../regions';
import {Sections} from '../../sections';
import _ from 'lodash';

export default {
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
    upsertRiver: (root, {river, language}, context) => {
      let _id = river._id;
      if (_id)
        editRiver._execute(context, {data: river, language});
      else
        _id = createRiver._execute(context, {data: river, language});
      return Rivers.findOne(_id);
    },
    removeRiver: (root, data, context) => {
      return removeRiver._execute(context, data) > 0;
    }
  },
  River: {
    region: (river, data, context, info) => {
      const fields = getFieldNames(info);
      //Only region ids are requested
      if (_.every(fields, f => f === '_id' || f === '__typename'))
        return {_id: river.regionId};
      else
        return Regions.findOne({_id: river.regionId});
    },
    sections: (river) => Sections.find({riverId: river._id}),
  }
};