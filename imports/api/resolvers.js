import sourcesResolvers from '../api/sources/server/resolvers';
import regionsResolvers from '../api/regions/server/resolvers';
import userResolvers from '../api/users/server/resolvers';
import gaugesResolvers from '../api/gauges/server/resolvers';
import {meteorResolver} from '../utils/ApolloUtils';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import _ from 'lodash';

let resolvers = _.merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
  gaugesResolvers,
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