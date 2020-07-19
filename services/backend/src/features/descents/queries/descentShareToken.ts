import { TopLevelResolver } from '~/apollo';

interface Vars {
  id: string;
}

const descentShareToken: TopLevelResolver<Vars> = async (
  _,
  { id },
  { dataSources },
) => {
  return null;
};

export default descentShareToken;
