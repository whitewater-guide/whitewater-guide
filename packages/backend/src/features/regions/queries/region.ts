import { NodeQuery, TopLevelResolver } from '@apollo';
import { RegionRaw } from '../types';

const region: TopLevelResolver<NodeQuery> = async (_, { id }, { models }) => {
  const result: RegionRaw | null = await models.regions.getById(id);
  if (result && result.hidden) {
    await models.regions.assertEditorPermissions(result.id);
  }
  return result;
};

export default region;
