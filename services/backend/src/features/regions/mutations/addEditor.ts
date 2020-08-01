import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  regionId: string;
  userId: string;
}

const addEditor: TopLevelResolver<Vars> = async (
  root,
  { regionId, userId },
) => {
  const query = db()
    .table('regions_editors')
    .insert({ region_id: regionId, user_id: userId });
  const rawQuery = `${query.toString()} ON CONFLICT DO NOTHING`;
  await db().raw(rawQuery);
  return true;
};

export default addEditor;
