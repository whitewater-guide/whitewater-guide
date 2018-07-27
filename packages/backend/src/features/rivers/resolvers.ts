import { listResolvers } from '@apollo';
import River from './fields';
import Mutation from './mutations';
import Query from './queries';

export const riversResolvers = {
  River,
  RiversList: listResolvers,
  Query,
  Mutation,
};
