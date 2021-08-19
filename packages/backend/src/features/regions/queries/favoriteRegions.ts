import { isAuthenticatedResolver, QueryResolvers } from '~/apollo';

const favoriteRegions: QueryResolvers['favoriteRegions'] = async (
  _,
  __,
  { user, dataSources },
  info,
) => {
  let query = dataSources.regions
    .getMany(info)
    .innerJoin('fav_regions', 'regions_view.id', 'fav_regions.region_id');
  query = query.where('user_id', user!.id);
  const result = await query;
  return result;
};

export default isAuthenticatedResolver(favoriteRegions);
