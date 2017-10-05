import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const result = await db().table('regions').del().where({ id }).returning('id');
  return result;
};

const removeRegion = isAdminResolver.createResolver(
  resolver,
);

export default removeRegion;
