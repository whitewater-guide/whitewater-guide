import { listResolvers } from '@apollo';
import { bannersResolvers, coverImageResolvers, regionFieldResolvers } from './fields';
import Mutation from './mutations';
import Query from './queries';

export const regionsResolvers = {
  Region: regionFieldResolvers,
  RegionBanners: bannersResolvers,
  RegionCoverImage: coverImageResolvers,
  RegionsList: listResolvers,
  Query,
  Mutation,
};
