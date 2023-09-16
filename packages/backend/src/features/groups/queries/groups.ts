import type { QueryResolvers } from '../../../apollo/index';

const groups: QueryResolvers['groups'] = (
  _,
  { regionId },
  { dataSources },
  info,
) => dataSources.groups.getMany(info, { regionId });

export default groups;
