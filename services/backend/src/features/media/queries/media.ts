import { NodeQuery, TopLevelResolver } from '@apollo';

const media: TopLevelResolver<NodeQuery> = (_, { id }, { dataSources }) =>
  dataSources.media.getById(id);

export default media;
