import sourcesResolvers from '../api/sources/server/resolvers';
import regionsResolvers from '../api/regions/server/resolvers';
import merge from 'lodash/merge';

export const resolvers = merge(sourcesResolvers, regionsResolvers);
