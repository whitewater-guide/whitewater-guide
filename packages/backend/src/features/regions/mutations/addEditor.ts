import { GraphQLFieldResolver } from 'graphql';
import { baseResolver, Context } from '../../../apollo';
import db from '../../../db';

interface Vars {
  regionId: string;
  userId: string;
}

const resolver: GraphQLFieldResolver<any, Context> = async (root, { regionId, userId }: Vars) => {
  const query = db().table('regions_editors').insert({ region_id: regionId, user_id: userId });
  const rawQuery = `${query.toString()} ON CONFLICT DO NOTHING`;
  await db().raw(rawQuery);
  return true;
};

const addEditor = baseResolver.createResolver(resolver);

export default addEditor;
