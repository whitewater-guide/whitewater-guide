import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const hasPremiumAccessResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({ id }, _, { dataSources }) => {
  const ids = await dataSources.purchases.getPurchasedRegions();
  return ids.includes(id);
};

export default hasPremiumAccessResolver;
