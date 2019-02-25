import { ListQuery, TopLevelResolver } from '@apollo';
import { SectionsFilter } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const sections: TopLevelResolver<Vars> = async (
  _,
  { filter, page },
  { dataSources },
  info,
) => {
  const result = await dataSources.sections.getMany(info, { filter, page });
  return result;
};

export default sections;
