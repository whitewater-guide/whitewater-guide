import { listResolvers } from '../../apollo/index';
import Source from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const sourcesResolvers = {
  Query,
  Mutation,
  Source,
  SourceGaugeConnection: listResolvers,
  SourceRegionConnection: listResolvers,
  SourcesList: listResolvers,
};
