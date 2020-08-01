import { ScriptDescriptor } from '@whitewater-guide/gorge';
import { TopLevelResolver } from '~/apollo';

const scripts: TopLevelResolver = async (_, __, { dataSources }) => {
  const data: ScriptDescriptor[] = await dataSources.gorge.listScripts();
  return data.map(({ name }) => ({
    id: name,
    name,
  }));
};

export default scripts;
