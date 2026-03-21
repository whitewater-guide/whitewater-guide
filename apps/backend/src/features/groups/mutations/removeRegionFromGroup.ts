import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeRegionFromGroup: MutationResolvers['removeRegionFromGroup'] =
  async (_, { regionId, groupId }) => {
    try {
      await db()
        .table('regions_groups')
        .del()
        .where({ region_id: regionId, group_id: groupId });
    } catch {
      /* Ignore */
    }
    return true;
  };

export default removeRegionFromGroup;
