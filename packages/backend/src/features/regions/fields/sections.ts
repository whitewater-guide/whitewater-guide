import { SectionsFilter } from '@whitewater-guide/commons';
import { GraphQLFieldResolver } from 'graphql';

import { Context, ListQuery } from '~/apollo';

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
