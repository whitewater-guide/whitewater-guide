import type { QueryResolvers } from '../../../apollo/index';

const source: QueryResolvers['source'] = (_, { id }, { dataSources }) =>
  dataSources.sources.getById(id);

export default source;
