import { TopLevelResolver } from '@apollo';

interface Vars {
  regionId?: string;
}

const groups: TopLevelResolver<Vars> = (_, { regionId }, { models }, info) =>
  models.groups.getMany(info, { regionId });

export default groups;
