import { ListQuery, TopLevelResolver } from '@apollo';
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
  const { regionId } = filter;
  const where = regionId ? { region_id: regionId } : undefined;
  const result = await dataSources.rivers.getMany(info, { where, page });
  return result;
};

export default rivers;
