import { RegionResolvers } from '~/apollo';

const bannersResolver: RegionResolvers['banners'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.banners.getMany(info, { regionId: id, page });

export default bannersResolver;
