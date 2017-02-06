import sourcesResolvers from '../api/sources/server/resolvers';
import regionsResolvers from '../api/regions/server/resolvers';
import riversResolvers from '../api/rivers/server/resolvers';
import userResolvers from '../api/users/server/resolvers';
import gaugesResolvers from '../api/gauges/server/resolvers';
import jobsResolvers from '../api/jobs/server/resolvers';
import {meteorResolver} from '../utils/ApolloUtils';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import _ from 'lodash';

let resolvers = _.merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
  riversResolvers,
  gaugesResolvers,
  jobsResolvers,
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