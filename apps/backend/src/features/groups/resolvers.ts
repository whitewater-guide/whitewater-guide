import { listResolvers } from '../../apollo/index';
import Group from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const groupsResolvers = {
  Group,
  Query,
  Mutation,
  GroupsList: listResolvers,
  GroupRegionConnection: listResolvers,
};
