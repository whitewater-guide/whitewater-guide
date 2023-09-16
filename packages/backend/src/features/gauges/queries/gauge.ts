import type { QueryResolvers } from '../../../apollo/index';

const gauge: QueryResolvers['gauge'] = (_, { id }, { dataSources }) =>
  dataSources.gauges.getById(id);

export default gauge;
