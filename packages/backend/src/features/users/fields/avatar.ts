import { UserResolvers } from '~/apollo';

const avatar: UserResolvers['avatar'] = (user, _, { dataSources }) => {
  if (!user) {
    return null;
  }
  return dataSources.users.getAvatar(user);
};

export default avatar;
