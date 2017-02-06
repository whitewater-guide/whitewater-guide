import {Sections, removeSection} from '../index';
import {Gauges} from '../../gauges';
import {Rivers} from '../../rivers';
import {Regions} from '../../regions';
import {Media} from '../../media';
import {Points} from '../../points';
import graphqlFields from 'graphql-fields';
import {pickFromSelf} from '../../../utils/ApolloUtils';
import _ from 'lodash';

export default {
  Query: {
    sections: (root, {terms, language}, context, info) => {
      //TODO: this can be refactored into graphql schema interface
      //and resolver wrapper for all other similar searches
      const query = graphqlFields(info);
      let fields = _.mapValues(query.sections, _.constant(1));
      //Add this for simple field resolvers
      fields = {...fields, riverId: 1, riverName: 1, regionId: 1, gaugeId: 1};
      let {sortBy, sortDirection = 'asc', skip = 0, limit = 10} = terms;
      limit = _.clamp(limit, 10, 100);
      const sort = (!sortBy || sortBy === 'name') ?
        [['riverName', sortDirection], ['name', sortDirection]] :
        [[sortBy, sortDirection]];
      const selector = _.pick(terms, ['regionId', 'riverId']);
      let result = {
        sections: Sections.find(selector, {fields, sort, skip, limit, lang: language}).fetch()
      };
      if (query.hasOwnProperty('count'))
        result.count = Sections.find(selector, {fields: {_id: 1}}).count();

      return result;
    },
  },
  Section: {
    gauge: section => Gauges.findOne(section.gaugeId),
    region: section => Regions.findOne(section.regionId),
    river: (section, args, context, info) => {
      const simpleResult = pickFromSelf(section, context, info, {_id: '_id', name: 'riverName'});
      if (simpleResult)
        return simpleResult;
      else
        return Rivers.findOne(section.riverId);
    },
    media: section => Media.find({_id: {$in: section.mediaIds}}),
    pois: section => Points.find({_id: {$in: section.poiIds}}),
  },
  Mutation: {
    removeSection: (root, data, context) => {
      return removeSection._execute(context, data) > 0;
    },
  }
}