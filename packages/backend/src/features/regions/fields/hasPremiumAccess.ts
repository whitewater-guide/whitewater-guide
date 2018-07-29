import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const hasPremiumAccessResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({ id }, _, { purchasesLoader }) => {
  const ids = await purchasesLoader.loadPurchasedRegions();
  return ids.includes(id);
};

export default hasPremiumAccessResolver;
