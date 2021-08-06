import { QueryResolvers } from '~/apollo';
import { Sql } from '~/db';

const region: QueryResolvers['region'] = async (_, { id }, { dataSources }) => {
  const result: Sql.RegionsView | null = await dataSources.regions.getById(id);
  if (result?.hidden) {
    await dataSources.users.assertEditorPermissions({ regionId: result.id });
  }
  return result;
};

export default region;
