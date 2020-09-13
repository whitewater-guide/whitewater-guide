import { GraphQLFieldResolver } from 'graphql';

import { Context, ListQuery } from '~/apollo';

import { RegionRaw } from '../types';

const bannersResolver: GraphQLFieldResolver<
  RegionRaw,
  Context,
  ListQuery
> = async ({ id }, { page }, { dataSources }, info) =>
  dataSources.banners.getMany(info, { regionId: id, page });

export default bannersResolver;
