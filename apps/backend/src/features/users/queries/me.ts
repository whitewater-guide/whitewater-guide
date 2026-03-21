import type { QueryResolvers } from '../../../apollo/index';

const me: QueryResolvers['me'] = async (_, __, { user, dataSources }) => {
  if (!user) {
    return null;
  }
  const result = await dataSources.users.getById(user.id);
  return result;
};

export default me;
