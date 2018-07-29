import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const regionsResolver: GraphQLFieldResolver<SourceRaw, Context, ListQuery> =
  async ({ id }, { page }, { models }, info) => {
    const query = models.regions.getMany(info, { page });
    query
      .innerJoin('sources_regions', 'regions_view.id', 'sources_regions.region_id')
      .where('sources_regions.source_id', '=', id);

    return query;
  };

export default regionsResolver;
