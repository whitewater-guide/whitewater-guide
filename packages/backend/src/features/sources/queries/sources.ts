import type { QueryResolvers } from '../../../apollo/index';

const sources: QueryResolvers['sources'] = async (
  _,
  { page },
  { dataSources },
  info,
) => {
  const result = await dataSources.sources.getMany(info, {
    page,
  });
  return result;
};

export default sources;
