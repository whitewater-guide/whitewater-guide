import { QueryResolvers } from '~/apollo';

const gauge: QueryResolvers['gauge'] = (_, { id }, { dataSources }) =>
  dataSources.gauges.getById(id);

export default gauge;
