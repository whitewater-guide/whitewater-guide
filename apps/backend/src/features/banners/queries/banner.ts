import type { QueryResolvers } from '../../../apollo/index';

const banner: QueryResolvers['banner'] = (_, { id }, { dataSources }) =>
  dataSources.banners.getById(id);

export default banner;
