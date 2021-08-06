import { RiverResolvers } from '~/apollo';

const regionResolver: RiverResolvers['region'] = (
  { region_id },
  _,
  { dataSources },
) => dataSources.regions.getById(region_id);

export default regionResolver;
