import { isAuthenticatedResolver, TopLevelResolver } from '~/apollo';

const promoRegions: TopLevelResolver = isAuthenticatedResolver(
  async (_, vars, { dataSources }, info) => {
    const purchasedIds = await dataSources.purchases.getPurchasedRegions();
    const query = dataSources.regions
      .getMany(info, { count: false })
      .where('regions_view.premium', true)
      .where('regions_view.hidden', false);
    if (purchasedIds && purchasedIds.length) {
      query.whereNotIn('regions_view.id', purchasedIds);
    }
    return query;
  },
);

export default promoRegions;
