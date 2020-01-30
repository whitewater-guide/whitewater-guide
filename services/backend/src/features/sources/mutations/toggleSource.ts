import { TopLevelResolver } from '@apollo';

interface Vars {
  id: string;
  enabled: boolean;
}

const toggleSource: TopLevelResolver<Vars> = async (
  _,
  { id, enabled },
  { dataSources },
) => {
  const res = await dataSources.gorge.toggleJobForSource(id, enabled);
  return { id, enabled: res };
};

export default toggleSource;
