import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const result = await db().table('sources').del().where({ id }).returning('id');
  return result;
};

const removeSource = isAdminResolver.createResolver(
  resolver,
);

export default removeSource;
