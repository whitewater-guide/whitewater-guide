import { baseResolver, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  regionId: string;
  userId: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { regionId, userId }) => {
  const query = db().table('regions_editors').insert({ region_id: regionId, user_id: userId });
  const rawQuery = `${query.toString()} ON CONFLICT DO NOTHING`;
  await db().raw(rawQuery);
  return true;
};

const addEditor = baseResolver.createResolver(resolver);

export default addEditor;
