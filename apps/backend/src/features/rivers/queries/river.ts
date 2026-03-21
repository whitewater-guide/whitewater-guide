import type { QueryResolvers } from '../../../apollo/index';

const river: QueryResolvers['river'] = async (_, { id }, { dataSources }) =>
  dataSources.rivers.getById(id);

export default river;
