import { TopLevelResolver } from '@apollo';
import { GorgeScript } from '@features/gorge';

const scripts: TopLevelResolver = async (_, __, { dataSources }) => {
  const data: GorgeScript[] = await dataSources.gorge.listScripts();
  return data.map(({ name }) => ({
    id: name,
    name,
  }));
};

export default scripts;
