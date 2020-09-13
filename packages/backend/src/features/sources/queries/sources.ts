import { ListQuery, TopLevelResolver } from '~/apollo';

const sources: TopLevelResolver<ListQuery> = async (
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
