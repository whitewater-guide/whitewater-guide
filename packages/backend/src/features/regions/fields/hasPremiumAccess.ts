import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const hasPremiumAccessResolver: GraphQLFieldResolver<RegionRaw, Context> = async ({ id }, _, { models }) => {
  const ids = await models.purchases.getPurchasedRegions();
  return ids.includes(id);
};

export default hasPremiumAccessResolver;
