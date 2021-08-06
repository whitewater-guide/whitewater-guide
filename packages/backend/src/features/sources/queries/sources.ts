import { QueryResolvers } from '~/apollo';

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
