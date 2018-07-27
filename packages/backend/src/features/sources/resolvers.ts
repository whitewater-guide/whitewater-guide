import { listResolvers } from '@apollo';
import Source from './fields';
import Mutation from './mutations';
import Query from './queries';

export const sourcesResolvers = {
  Query,
  Mutation,
  Source,
  SourcesList: listResolvers,
};
