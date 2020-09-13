import { RegionFilterOptions } from '@whitewater-guide/commons';

import { ListQuery, TopLevelResolver } from '~/apollo';

interface Vars extends ListQuery {
  filter: RegionFilterOptions;
}

const regions: TopLevelResolver<Vars> = async (
  _,
  { page, filter = {} },
  { dataSources },
  info,
) => {
  let query = dataSources.regions.getMany(info, { page });
  const { searchString } = filter;
  if (searchString) {
    query = query.where('name', 'ilike', `%${searchString}%`);
  }
  const result = await query;
  return result;
};

export default regions;
