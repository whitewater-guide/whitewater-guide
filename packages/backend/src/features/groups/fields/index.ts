import { FieldResolvers } from '@apollo';
import { Group } from '@ww-commons';
import { GroupRaw } from '../types';

const resolvers: FieldResolvers<GroupRaw, Group> = {
  // TODO: reimplement using model
  regions: () => [],
};

export default resolvers;
