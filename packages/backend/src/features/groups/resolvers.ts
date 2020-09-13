import { listResolvers } from '~/apollo';

import Group from './fields';
import Mutation from './mutations';
import Query from './queries';

export const groupsResolvers = {
  Group,
  Query,
  Mutation,
  GroupsList: listResolvers,
  GroupRegionConnection: listResolvers,
};
