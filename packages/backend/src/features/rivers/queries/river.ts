import { NodeQuery, TopLevelResolver } from '@apollo';

const river: TopLevelResolver<NodeQuery> = async (_, { id }, { models }) =>
  models.rivers.getById(id);

export default river;
