import { TopLevelResolver, MutationNotAllowedError } from '@apollo';
import db from '@db';

interface Vars {
  riverId: string;
  regionId: string;
}

const changeRiverRegion: TopLevelResolver<Vars> = async (
  _,
  { riverId, regionId },
  { dataSources },
) => {
  const region = await dataSources.regions.getById(regionId);
  if (region == null) {
    throw new MutationNotAllowedError('Region does not exist');
  }

  await dataSources.regions.assertEditorPermissions(regionId);
  await dataSources.rivers.assertEditorPermissions(riverId);

  await db()
    .table('rivers')
    .update({ region_id: regionId })
    .where({ id: riverId });

  return db()
    .table('rivers')
    .where({ id: riverId })
    .first();
};

export default changeRiverRegion;
