import { harvestStatusResolvers } from './fields/index';
import Query from './queries/index';

export const measurementsResolvers = {
  Query,
  HarvestStatus: harvestStatusResolvers,
};
