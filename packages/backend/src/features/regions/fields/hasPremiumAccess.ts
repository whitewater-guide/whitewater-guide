import type { Context, RegionResolvers } from '../../../apollo/index';
import type { ResolvableRegion } from '../types';

const hasPremiumAccessResolver: RegionResolvers<
  Context,
  ResolvableRegion
>['hasPremiumAccess'] = async ({ id, editable }, _, { dataSources, user }) => {
  if (user?.admin || editable) {
    return true;
  }
  const ids = await dataSources.purchases.getPurchasedRegions();
  return ids.includes(id);
};

export default hasPremiumAccessResolver;
