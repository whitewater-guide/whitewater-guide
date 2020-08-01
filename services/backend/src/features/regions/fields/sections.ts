import { Context, ListQuery } from '~/apollo';
import { SectionsFilter } from '~/features/sections';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const sectionsResolver: GraphQLFieldResolver<RegionRaw, Context, Vars> = async (
  { id },
  { page, filter = {} },
  { dataSources },
  info,
) => {
  const { updatedAfter } = filter;
  return dataSources.sections.getMany(info, {
    page,
    filter: { regionId: id, updatedAfter },
  });
};

export default sectionsResolver;
