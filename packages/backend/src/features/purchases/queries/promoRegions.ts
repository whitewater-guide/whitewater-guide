import { Context, isAuthenticatedResolver } from '@apollo';

const promoRegions = isAuthenticatedResolver.createResolver(
  async (_, vars, { models }: Context, info) => {
    const purchasedIds = await models.purchases.getPurchasedRegions();
    const query = models.regions.getMany(info, { count: false })
      .where('regions_view.premium', true)
      .where('regions_view.hidden', false);
    if (purchasedIds && purchasedIds.length) {
      query.whereNotIn('regions_view.id', purchasedIds);
    }
    return query;
  },
);

export default promoRegions;
