import { NodeQuery, TopLevelResolver } from '@apollo';

const source: TopLevelResolver<NodeQuery> = (_, { id }, { models }) =>
  models.sources.getById(id);

export default source;
