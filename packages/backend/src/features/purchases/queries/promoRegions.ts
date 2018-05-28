import { Context, isAuthenticatedResolver } from '../../../apollo';
import { buildRegionQuery } from '../../regions';

const promoRegions = isAuthenticatedResolver.createResolver(
  async (_, vars, context: Context, info) => {
    const purchasedIds = await context.purchasesLoader.loadPurchasedRegions();
    const query = buildRegionQuery({ info, context })
      .where('regions_view.premium', true)
      .where('regions_view.hidden', false);
    if (purchasedIds && purchasedIds.length) {
      query.whereNotIn('regions_view.id', purchasedIds);
    }
    return query;
  },
);

export default promoRegions;
