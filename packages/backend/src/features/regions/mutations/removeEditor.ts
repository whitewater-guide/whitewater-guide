import { TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  regionId: string;
  userId: string;
}

const removeEditor: TopLevelResolver<Vars> = async (root, { regionId, userId }: Vars) => {
  await db().table('regions_editors').del().where({ region_id: regionId, user_id: userId });
  return true;
};

export default removeEditor;
