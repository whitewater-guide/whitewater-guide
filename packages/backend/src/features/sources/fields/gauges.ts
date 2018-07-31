import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const gaugesResolver: GraphQLFieldResolver<SourceRaw, Context, ListQuery> =
  async ({ id }, { page }, { dataSources }, info) =>
    dataSources.gauges.getMany(info, { page, where: { source_id: id } });

export default gaugesResolver;
