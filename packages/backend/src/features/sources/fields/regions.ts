import { GraphQLFieldResolver } from 'graphql';

import { Context, ListQuery } from '~/apollo';

import { SourceRaw } from '../types';

const regionsResolver: GraphQLFieldResolver<
  SourceRaw,
  Context,
  ListQuery
> = async ({ id }, { page }, { dataSources }, info) => {
  const query = dataSources.regions.getMany(info, { page });
  query
    .innerJoin(
      'sources_regions',
      'regions_view.id',
      'sources_regions.region_id',
    )
    .where('sources_regions.source_id', '=', id);

  return query;
};

export default regionsResolver;
