import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';

const addRegionToGroup: MutationResolvers['addRegionToGroup'] = async (
  _,
  { regionId, groupId },
) => {
  const q = db()
    .table('regions_groups')
    .insert({ region_id: regionId, group_id: groupId });
  await db().raw(`${q.toString()} ON CONFLICT DO NOTHING`);
  return true;
};

export default addRegionToGroup;
