import { ListQuery, TopLevelResolver } from '~/apollo';
import { RegionFilterOptions } from '@whitewater-guide/commons';

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
