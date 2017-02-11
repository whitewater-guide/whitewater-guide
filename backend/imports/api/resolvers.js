import sourcesResolvers from './sources/resolvers';
import regionsResolvers from './regions/resolvers';
import riversResolvers from './rivers/resolvers';
import sectionsResolvers from './sections/resolvers';
import userResolvers from './users/resolvers';
import gaugesResolvers from './gauges/resolvers';
import jobsResolvers from './jobs/resolvers';
import tagsResolvers from './tags/resolvers';
import {meteorResolver} from '../utils/ApolloUtils';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import _ from 'lodash';

let resolvers = _.merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
  riversResolvers,
  sectionsResolvers,
  gaugesResolvers,
  jobsResolvers,
  tagsResolvers
);

//Decorate resolvers to make them more meteor-friendly
resolvers = _.mapValues(resolvers, graphqlType => _.mapValues(graphqlType, meteorResolver));
resolvers = _.merge(
  resolvers,
  {
    "JSON": GraphQLJSON,
    "Date": GraphQLDate,
  },
);

export {
  resolvers
};