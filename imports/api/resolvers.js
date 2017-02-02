import sourcesResolvers from '../api/sources/server/resolvers';
import regionsResolvers from '../api/regions/server/resolvers';
import userResolvers from '../api/users/server/resolvers';
import merge from 'lodash/merge';

export const resolvers = merge(
  userResolvers,
  sourcesResolvers,
  regionsResolvers,
);
