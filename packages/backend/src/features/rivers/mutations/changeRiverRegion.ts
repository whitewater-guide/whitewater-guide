import type { MutationResolvers } from '../../../apollo/index';
import { MutationNotAllowedError } from '../../../apollo/index';
import { db } from '../../../db/index';

const changeRiverRegion: MutationResolvers['changeRiverRegion'] = async (
  _,
  { riverId, regionId },
  { dataSources },
) => {
  const region = await dataSources.regions.getById(regionId);
  if (region === null) {
    throw new MutationNotAllowedError('Region does not exist');
  }

  await dataSources.users.assertEditorPermissions({ regionId });
  await dataSources.users.assertEditorPermissions({ riverId });

  await db()
    .table('rivers')
    .update({ region_id: regionId })
    .where({ id: riverId });

  return db().table('rivers').where({ id: riverId }).first();
};

export default changeRiverRegion;
