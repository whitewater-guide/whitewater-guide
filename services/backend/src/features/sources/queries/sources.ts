import { ListQuery, TopLevelResolver } from '@apollo';

const sources: TopLevelResolver<ListQuery> = async (
  _,
  { page },
  { dataSources },
  info,
) =>
  dataSources.sources.getMany(info, {
    page,
  });

export default sources;
