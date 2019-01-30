import { TopLevelResolver } from '@apollo';

interface Vars {
  regionId?: string;
}

const groups: TopLevelResolver<Vars> = (
  _,
  { regionId },
  { dataSources },
  info,
) => dataSources.groups.getMany(info, { regionId });

export default groups;
