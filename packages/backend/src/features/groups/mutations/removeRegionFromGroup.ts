import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

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
