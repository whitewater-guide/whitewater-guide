import gqf from 'graphql-fields';

import type { SectionResolvers } from '../../../apollo/index';

const EMBEDDED_RIVER_FIELDS = ['__typename', 'id', 'name'];

const riverResolver: SectionResolvers['river'] = async (
  { river_id, river_name },
  _,
  { dataSources },
  info,
) => {
  const tree = gqf(info);
  if (Object.keys(tree).every((name) => EMBEDDED_RIVER_FIELDS.includes(name))) {
    return {
      id: river_id,
      name: river_name,
    };
  }
  const river = await dataSources.rivers.getById(river_id);
  return river!;
};

export default riverResolver;
