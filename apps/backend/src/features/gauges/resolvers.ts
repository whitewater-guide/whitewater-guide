import { listResolvers } from '../../apollo/index';
import Gauge from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const gaugesResolvers = {
  Gauge,
  GaugesList: listResolvers,
  Query,
  Mutation,
};
