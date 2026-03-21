import gqf from 'graphql-fields';

import type { SectionResolvers } from '../../../apollo/index';

const EMBEDDED_REGION_FIELDS = ['__typename', 'id', 'name'];

const regionResolver: SectionResolvers['region'] = async (
  { region_id, region_name },
  _,
  { dataSources },
  info,
) => {
  const tree = gqf(info);
  if (
    region_name &&
    Object.keys(tree).every((name) => EMBEDDED_REGION_FIELDS.includes(name))
  ) {
    return {
      id: region_id,
      name: region_name,
    };
  }
  const region = await dataSources.regions.getById(region_id);
  return region!;
};

export default regionResolver;
