import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = (root, { id }: RemoveVariables) =>
  db().table('regions').del().where({ id }).returning('id');

const removeRegion = isAdminResolver.createResolver(
  resolver,
);

export default removeRegion;
