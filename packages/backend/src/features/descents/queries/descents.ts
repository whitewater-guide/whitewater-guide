import type { QueryResolvers } from '../../../apollo/index';

const descents: QueryResolvers['descents'] = async (
  _,
  { filter, page },
  { dataSources },
) => {
  const result = await dataSources.descents.getMany({ filter, page });
  return result;
};

export default descents;
