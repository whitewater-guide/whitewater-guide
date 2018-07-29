import { NodeQuery, TopLevelResolver } from '@apollo';

const gauge: TopLevelResolver<NodeQuery> = (_, { id }, { models }) =>
  models.gauges.getById(id);

export default gauge;
