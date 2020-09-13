import { harvestStatusResolvers } from './fields';
import Query from './queries';

export const measurementsResolvers = {
  Query,
  HarvestStatus: harvestStatusResolvers,
};
