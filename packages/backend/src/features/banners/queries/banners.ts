import { QueryResolvers } from '~/apollo';

const banners: QueryResolvers['banners'] = (_, __, { dataSources }, info) =>
  dataSources.banners.getMany(info);

export default banners;
