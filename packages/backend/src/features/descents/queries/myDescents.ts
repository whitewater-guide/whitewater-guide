import { AuthenticatedQuery, isAuthenticatedResolver } from '~/apollo';

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
