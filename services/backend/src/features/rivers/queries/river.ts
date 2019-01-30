import { NodeQuery, TopLevelResolver } from '@apollo';

const river: TopLevelResolver<NodeQuery> = async (_, { id }, { dataSources }) =>
  dataSources.rivers.getById(id);

export default river;
