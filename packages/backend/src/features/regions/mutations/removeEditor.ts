import { GraphQLFieldResolver } from 'graphql';
import { baseResolver, Context } from '../../../apollo';
import db from '../../../db';

interface Vars {
  regionId: string;
  userId: string;
}

const resolver: GraphQLFieldResolver<any, Context> = async (root, { regionId, userId }: Vars) => {
  await db().table('regions_editors').del().where({ region_id: regionId, user_id: userId });
  return true;
};

const removeEditor = baseResolver.createResolver(resolver);

export default removeEditor;
