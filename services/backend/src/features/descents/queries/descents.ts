import { TopLevelResolver } from '~/apollo';

interface Vars {
  id: string;
}

const descents: TopLevelResolver<Vars> = async (_, { id }, { dataSources }) => {
  return null;
};

export default descents;
