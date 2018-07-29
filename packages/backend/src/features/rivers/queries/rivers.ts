import { ListQuery, TopLevelResolver } from '@apollo';
import { RiversFilter } from '@ww-commons';

interface Vars extends ListQuery {
  filter?: RiversFilter;
}

const rivers: TopLevelResolver<Vars> = (_, { filter = {}, page }, { models }, info) => {
  const { regionId } = filter;
  const where = regionId ? { region_id: regionId } : undefined;
  return models.rivers.getMany(info, { where, page });
};

export default rivers;
