import type { BannerResolvers } from '../../../apollo/index';

export const bannerResolvers: BannerResolvers = {
  regions: ({ id }, _, { dataSources }, info) => {
    const query = dataSources.regions.getMany(info);
    query
      .innerJoin(
        'banners_regions',
        `regions_view.id`,
        'banners_regions.region_id',
      )
      .where('banners_regions.banner_id', '=', id);
    return query;
  },
  groups: ({ id }, _, { dataSources }, info) => {
    const query = dataSources.groups.getMany(info);
    query
      .innerJoin('banners_groups', `groups_view.id`, 'banners_groups.group_id')
      .where('banners_groups.banner_id', '=', id);
    return query;
  },
};
