import { listResolvers } from '../../apollo/index';
import River from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const riversResolvers = {
  River,
  RiversList: listResolvers,
  RiverSectionConnection: listResolvers,
  Query,
  Mutation,
};
