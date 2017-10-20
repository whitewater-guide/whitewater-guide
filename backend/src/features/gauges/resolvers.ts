import { listResolvers } from '../../apollo';
import Gauge from './fields';
// import Mutation from './mutations';
import Query from './queries';

export const gaugesResolvers = {
  Gauge,
  GaugesList: listResolvers,
  Query,
  // Mutation,
};
