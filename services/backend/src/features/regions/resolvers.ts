import { listResolvers } from '~/apollo';
import { coverImageResolvers, regionFieldResolvers } from './fields';
import Mutation from './mutations';
import Query from './queries';

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
