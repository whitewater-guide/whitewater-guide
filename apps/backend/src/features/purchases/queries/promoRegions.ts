import type { AuthenticatedQuery } from '../../../apollo/index';
import { isAuthenticatedResolver } from '../../../apollo/index';

const promoRegions: AuthenticatedQuery['promoRegions'] = async (
  _,
  _vars,
  { dataSources },
  info,
) => {
  const purchasedIds = await dataSources.purchases.getPurchasedRegions();
  const query = dataSources.regions
    // .getMany(info, { count: false })
    .getMany(info)
    .where('regions_view.premium', true)
    .where('regions_view.hidden', false);
  if (purchasedIds?.length) {
    query.whereNotIn('regions_view.id', purchasedIds);
  }
  return query;
};
export default isAuthenticatedResolver(promoRegions);
