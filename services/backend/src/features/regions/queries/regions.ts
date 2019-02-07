import { ListQuery, TopLevelResolver } from '@apollo';
import { RegionsFilter } from '@whitewater-guide/commons';

interface Vars extends ListQuery {
  filter: RegionsFilter;
}

const regions: TopLevelResolver<Vars> = async (
  _,
  { page, filter = {} },
  { dataSources },
  info,
) => {
  let query = dataSources.regions.getMany(info, { page });
  const { search } = filter;
  if (search) {
    query = query.where('name', 'ilike', `%${search}%`);
  }
  return query;
};

export default regions;
