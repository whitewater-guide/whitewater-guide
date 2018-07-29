import { ListQuery, TopLevelResolver } from '@apollo';
import { SectionsFilter } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const sections: TopLevelResolver<Vars> = (_, { filter, page }, { models }, info) =>
  models.sections.getMany(info, { filter, page });

export default sections;
