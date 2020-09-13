import { listResolvers } from '~/apollo';

import { bannerResolvers, bannerSourceResolvers } from './fields';
import Mutation from './mutations';
import Query from './queries';

export const bannersResolvers = {
  Banner: bannerResolvers,
  BannerSource: bannerSourceResolvers,
  Query,
  Mutation,
  BannersList: listResolvers,
  BannerRegionConnection: listResolvers,
  BannerGroupConnection: listResolvers,
};
