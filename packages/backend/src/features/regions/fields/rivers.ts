import { RegionResolvers } from '~/apollo';

const riversResolver: RegionResolvers['rivers'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.rivers.getMany(info, { page, where: { region_id: id } });

export default riversResolver;
