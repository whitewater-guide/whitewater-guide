import { ListQuery, TopLevelResolver } from '~/apollo';
import { RiversFilter } from '@whitewater-guide/commons';

interface Vars extends ListQuery {
  filter?: RiversFilter;
}

const rivers: TopLevelResolver<Vars> = async (
  _,
  { filter = {}, page },
  { dataSources },
  info,
) => {
  const { regionId, search } = filter;
  const where = regionId ? { region_id: regionId } : undefined;
  let query = dataSources.rivers.getMany(info, { where, page });
  if (search) {
    query = query.where('name', 'ilike', `%${search}%`);
  }
  const result = await query;
  return result;
};

export default rivers;
