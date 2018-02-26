import { listResolvers } from '../../apollo';
import Region from './fields';
import Mutation from './mutations';
import Query from './queries';

export const regionsResolvers = {
  Region,
  RegionsList: listResolvers,
  Query,
  Mutation,
};
