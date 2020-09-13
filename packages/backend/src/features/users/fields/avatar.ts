import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';
import { UserRaw } from '~/features/users';

const avatar: GraphQLFieldResolver<UserRaw, Context> = (
  user,
  _,
  { dataSources },
) => {
  if (!user) {
    return null;
  }
  return dataSources.users.getAvatar(user);
};

export default avatar;
