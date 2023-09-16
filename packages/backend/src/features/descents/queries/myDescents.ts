import type { AuthenticatedQuery } from '../../../apollo/index';
import { isAuthenticatedResolver } from '../../../apollo/index';

const myDescents: AuthenticatedQuery['myDescents'] = async (
  _,
  { filter, page },
  { dataSources, user },
) => {
  const result = await dataSources.descents.getMany({
    filter: { ...filter, userId: user.id },
    page,
  });
  return result;
};

export default isAuthenticatedResolver(myDescents);
