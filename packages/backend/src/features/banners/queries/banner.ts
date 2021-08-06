import { QueryResolvers } from '~/apollo';

const banner: QueryResolvers['banner'] = (_, { id }, { dataSources }) =>
  dataSources.banners.getById(id);

export default banner;
