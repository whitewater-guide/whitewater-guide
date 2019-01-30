import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const gaugesResolver: GraphQLFieldResolver<
  RegionRaw,
  Context,
  ListQuery
> = async ({ id }, { page }, { dataSources }, info) => {
  const query = dataSources.gauges.getMany(info, { page });
  query
    .innerJoin(
      'sources_regions',
      'gauges_view.source_id',
      'sources_regions.source_id',
    )
    .where('sources_regions.region_id', '=', id);

  return query;
};

export default gaugesResolver;
