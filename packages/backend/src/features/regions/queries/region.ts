import { NodeQuery, TopLevelResolver } from '~/apollo';

import { RegionRaw } from '../types';

const region: TopLevelResolver<NodeQuery> = async (
  _,
  { id },
  { dataSources },
) => {
  const result: RegionRaw | null = await dataSources.regions.getById(id);
  if (result && result.hidden) {
    await dataSources.users.assertEditorPermissions({ regionId: result.id });
  }
  return result;
};

export default region;
