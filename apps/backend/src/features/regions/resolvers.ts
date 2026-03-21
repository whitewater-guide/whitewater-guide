import { listResolvers } from '../../apollo/index';
import { coverImageResolvers, regionFieldResolvers } from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const regionsResolvers = {
  Region: regionFieldResolvers,
  RegionCoverImage: coverImageResolvers,
  RegionsList: listResolvers,
  RegionRiverConnection: listResolvers,
  RegionGaugeConnection: listResolvers,
  RegionSectionConnection: listResolvers,
  RegionSourceConnection: listResolvers,
  RegionBannerConnection: listResolvers,
  Query,
  Mutation,
};
