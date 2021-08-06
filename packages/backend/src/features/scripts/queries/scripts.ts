import { ScriptDescriptor } from '@whitewater-guide/gorge';

import { QueryResolvers } from '~/apollo';

const scripts: QueryResolvers['scripts'] = async (_, __, { dataSources }) => {
  const data: ScriptDescriptor[] = await dataSources.gorge.listScripts();
  return data.map(({ name }) => ({
    id: name,
    name,
  }));
};

export default scripts;
