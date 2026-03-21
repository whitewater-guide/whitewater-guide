import type { QueryResolvers } from '../../../apollo/index';
import type { Sql } from '../../../db/index';

const region: QueryResolvers['region'] = async (_, { id }, { dataSources }) => {
  const result: Sql.RegionsView | null = await dataSources.regions.getById(id);
  if (result?.hidden) {
    await dataSources.users.assertEditorPermissions({ regionId: result.id });
  }
  return result;
};

export default region;
