import type { UserResolvers } from '../../../apollo/index';

const avatar: UserResolvers['avatar'] = async (user, _, { dataSources }) => {
  if (!user) {
    return null;
  }
  const avatar = await dataSources.users.getAvatar(user as any);
  return avatar!;
};

export default avatar;
