import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { RegionRaw } from '../types';

const hasPremiumAccessResolver: GraphQLFieldResolver<
  RegionRaw,
  Context
> = async ({ id, editable }, _, { dataSources, user }) => {
  if ((user && user.admin) || editable) {
    return true;
  }
  const ids = await dataSources.purchases.getPurchasedRegions();
  return ids.includes(id);
};

export default hasPremiumAccessResolver;
