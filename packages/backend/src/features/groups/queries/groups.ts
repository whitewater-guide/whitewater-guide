import { QueryResolvers } from '~/apollo';

const groups: QueryResolvers['groups'] = (
  _,
  { regionId },
  { dataSources },
  info,
) => dataSources.groups.getMany(info, { regionId });

export default groups;
