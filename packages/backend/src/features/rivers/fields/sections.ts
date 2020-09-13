import { GraphQLFieldResolver } from 'graphql';

import { Context, ListQuery } from '~/apollo';

import { RiverRaw } from '../types';

const sectionsResolver: GraphQLFieldResolver<
  RiverRaw,
  Context,
  ListQuery
> = async ({ id }, { page }, { dataSources }, info) =>
  dataSources.sections.getMany(info, { page, filter: { riverId: id } });

export default sectionsResolver;
