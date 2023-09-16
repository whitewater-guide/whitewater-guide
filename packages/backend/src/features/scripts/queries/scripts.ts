import type { ScriptDescriptor } from '@whitewater-guide/gorge';

import type { QueryResolvers } from '../../../apollo/index';

const scripts: QueryResolvers['scripts'] = async (_, __, { dataSources }) => {
  const data: ScriptDescriptor[] = await dataSources.gorge.listScripts();
  return data.map(({ name }) => ({
    id: name,
    name,
  }));
};

export default scripts;
