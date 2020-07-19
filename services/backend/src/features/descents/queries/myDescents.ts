import { TopLevelResolver } from '~/apollo';

interface Vars {
  id: string;
}

const myDescents: TopLevelResolver<Vars> = async (
  _,
  { id },
  { dataSources },
) => {
  return null;
};

export default myDescents;
