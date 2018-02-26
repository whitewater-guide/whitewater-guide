import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const { count: sectionsCount } = await db().table('sections').where({ river_id: id }).count().first();
  if (sectionsCount > 0) {
    throw new MutationNotAllowedError({ message: 'Delete all sections first!' });
  }
  return db().table('rivers').del().where({ id }).returning('id');
};

const removeRiver = isAdminResolver.createResolver(
  resolver,
);

export default removeRiver;
