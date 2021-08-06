import { QueryResolvers } from '~/apollo';

const source: QueryResolvers['source'] = (_, { id }, { dataSources }) =>
  dataSources.sources.getById(id);

export default source;
