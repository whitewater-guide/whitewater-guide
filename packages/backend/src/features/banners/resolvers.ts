import { listResolvers } from '../../apollo/index';
import { bannerResolvers, bannerSourceResolvers } from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const bannersResolvers = {
  Banner: bannerResolvers,
  BannerSource: bannerSourceResolvers,
  Query,
  Mutation,
  BannersList: listResolvers,
  BannerRegionConnection: listResolvers,
  BannerGroupConnection: listResolvers,
};
