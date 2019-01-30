import { NodeQuery, TopLevelResolver } from '@apollo';

const source: TopLevelResolver<NodeQuery> = (_, { id }, { dataSources }) =>
  dataSources.sources.getById(id);

export default source;
