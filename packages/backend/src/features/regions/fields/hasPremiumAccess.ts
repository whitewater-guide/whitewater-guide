import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const hasPremiumAccessResolver: GraphQLFieldResolver<RegionRaw, Context> =
  async ({ id, editable }, _, { dataSources, user }) => {
    if ((user && user.admin) || editable) {
      return true;
    }
    const ids = await dataSources.purchases.getPurchasedRegions();
    return ids.includes(id);
  };

export default hasPremiumAccessResolver;
