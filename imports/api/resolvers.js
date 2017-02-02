import sourcesResolvers from '../api/sources/server/resolvers';
import regionsResolvers from '../api/regions/server/resolvers';
import userResolvers from '../api/users/server/resolvers';
import {meteorResolver} from '../utils/ApolloUtils';
import _ from 'lodash';

let resolvers = _.merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
);
//Decorate resolvers to make them more meteor-friendly
resolvers = _.mapValues(resolvers, graphqlType => _.mapValues(graphqlType, meteorResolver));

export {
  resolvers
};