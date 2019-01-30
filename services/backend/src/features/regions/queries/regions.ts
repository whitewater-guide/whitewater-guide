import { ListQuery, TopLevelResolver } from '@apollo';

const regions: TopLevelResolver<ListQuery> = async (
  _,
  { page },
  { dataSources },
  info,
) => dataSources.regions.getMany(info, { page });

export default regions;
