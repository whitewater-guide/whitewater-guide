import { NodeQuery, TopLevelResolver } from '@apollo';

const banner: TopLevelResolver<NodeQuery> = (_, { id }, { dataSources }) =>
  dataSources.banners.getById(id);

export default banner;
