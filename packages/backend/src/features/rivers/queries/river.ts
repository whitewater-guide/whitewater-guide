import { QueryResolvers } from '~/apollo';

const river: QueryResolvers['river'] = async (_, { id }, { dataSources }) =>
  dataSources.rivers.getById(id);

export default river;
