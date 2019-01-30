import { listResolvers } from '@apollo';
import Banner from './fields';
import Mutation from './mutations';
import Query from './queries';

export const bannersResolvers = {
  Banner,
  Query,
  Mutation,
  BannersList: listResolvers,
  BannerRegionConnection: listResolvers,
  BannerGroupConnection: listResolvers,
};
