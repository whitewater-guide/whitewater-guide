import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { User, UserRaw } from '../types';

const resolvers: FieldResolvers<UserRaw, User> = {
  ...timestampResolvers,
};

export default resolvers;
