import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const sourcesResolver: GraphQLFieldResolver<RegionRaw, Context, ListQuery> =
  async ({ id }, { page }, { models }, info) => {
    const query = models.sources.getMany(info, { page });
    query
      .innerJoin('sources_regions', 'sources_view.id', 'sources_regions.source_id')
      .where('sources_regions.region_id', '=', id);

    return query;
  };

export default sourcesResolver;
