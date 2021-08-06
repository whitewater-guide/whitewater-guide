import { AuthenticatedMutation, isAuthenticatedResolver } from '~/apollo';

const resolver: AuthenticatedMutation['deleteDescent'] = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources.descents.deleteById(id);
  return true;
};

const deleteDescent = isAuthenticatedResolver(resolver);

export default deleteDescent;
