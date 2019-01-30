import { ListQuery, TopLevelResolver } from '@apollo';
import { RiversFilter } from '@whitewater-guide/commons';

interface Vars extends ListQuery {
  filter?: RiversFilter;
}

const rivers: TopLevelResolver<Vars> = (
  _,
  { filter = {}, page },
  { dataSources },
  info,
) => {
  const { regionId } = filter;
  const where = regionId ? { region_id: regionId } : undefined;
  return dataSources.rivers.getMany(info, { where, page });
};

export default rivers;
