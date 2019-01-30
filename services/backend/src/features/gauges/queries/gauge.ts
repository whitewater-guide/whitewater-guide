import { NodeQuery, TopLevelResolver } from '@apollo';

const gauge: TopLevelResolver<NodeQuery> = (_, { id }, { dataSources }) =>
  dataSources.gauges.getById(id);

export default gauge;
