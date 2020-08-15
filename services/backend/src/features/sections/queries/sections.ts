import { SectionsFilter } from '@whitewater-guide/commons';
import { ListQuery, TopLevelResolver } from '~/apollo';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const sections: TopLevelResolver<Vars> = async (
  _,
  { filter, page },
  { dataSources, user },
  info,
) => {
  if (filter?.editable && !user) {
    return [];
  }
  const result = await dataSources.sections.getMany(info, { filter, page });
  return result;
};

export default sections;
