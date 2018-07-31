import { ListQuery, TopLevelResolver } from '@apollo';
import { SectionsFilter } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const sections: TopLevelResolver<Vars> = (_, { filter, page }, { dataSources }, info) =>
  dataSources.sections.getMany(info, { filter, page });

export default sections;
