import { Context } from '@apollo';
import { UserRaw } from '@features/users';
import { GraphQLFieldResolver } from 'graphql';

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
