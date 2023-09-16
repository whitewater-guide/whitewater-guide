import type { RiverResolvers } from '../../../apollo/index';

const regionResolver: RiverResolvers['region'] = async (
  { region_id },
  _,
  { dataSources },
) => {
  const region = await dataSources.regions.getById(region_id);
  return region!;
};

export default regionResolver;
