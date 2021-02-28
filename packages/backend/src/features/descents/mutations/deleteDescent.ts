import { AuthenticatedTopLevelResolver } from '~/apollo';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';

interface Vars {
  id: string;
}

const resolver: AuthenticatedTopLevelResolver<Vars> = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources.descents.deleteById(id);
  return true;
};

const deleteDescent = isAuthenticatedResolver(resolver);

export default deleteDescent;
