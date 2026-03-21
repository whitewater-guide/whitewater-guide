import type { RegionResolvers } from '../../../apollo/index';

const bannersResolver: RegionResolvers['banners'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.banners.getMany(info, { regionId: id, page });

export default bannersResolver;
