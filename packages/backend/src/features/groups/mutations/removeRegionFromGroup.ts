import { baseResolver } from '../../../apollo';
import db from '../../../db';

interface Vars {
  regionId: string;
  groupId: string;
}

const removeRegionFromGroup = baseResolver.createResolver(
  async (root, { regionId, groupId }: Vars) => {
    try {
      await db().table('regions_groups').del().where({ region_id: regionId, group_id: groupId });
    } catch {}
    return true;
  },
);

export default removeRegionFromGroup;
