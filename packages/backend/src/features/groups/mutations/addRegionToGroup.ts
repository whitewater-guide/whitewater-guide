import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  regionId: string;
  groupId: string;
}

const addRegionToGroup: TopLevelResolver<Vars> = async (
  root,
  { regionId, groupId }: Vars,
) => {
  const q = db()
    .table('regions_groups')
    .insert({ region_id: regionId, group_id: groupId });
  await db().raw(`${q.toString()} ON CONFLICT DO NOTHING`);
  return true;
};

export default addRegionToGroup;
