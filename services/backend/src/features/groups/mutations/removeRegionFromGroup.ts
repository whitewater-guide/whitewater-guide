import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  regionId: string;
  groupId: string;
}

const removeRegionFromGroup: TopLevelResolver<Vars> = async (
  root,
  { regionId, groupId }: Vars,
) => {
  try {
    await db()
      .table('regions_groups')
      .del()
      .where({ region_id: regionId, group_id: groupId });
  } catch {}
  return true;
};

export default removeRegionFromGroup;
