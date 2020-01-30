import { GorgeScript } from '@features/gorge';
import { TopLevelResolver } from '@apollo';

const scripts: TopLevelResolver = async (_, __, { dataSources }) => {
  const data: GorgeScript[] = await dataSources.gorge.listScripts();
  return data.map(({ name, mode }) => ({
    id: name,
    name,
    harvestMode: mode,
  }));
};

export default scripts;
