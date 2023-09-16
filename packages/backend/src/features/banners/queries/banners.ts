import type { QueryResolvers } from '../../../apollo/index';

const banners: QueryResolvers['banners'] = (_, __, { dataSources }, info) =>
  dataSources.banners.getMany(info);

export default banners;
