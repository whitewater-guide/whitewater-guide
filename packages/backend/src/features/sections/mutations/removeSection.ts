import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = (root, { id }: RemoveVariables) =>
  db().table('sections').del().where({ id }).returning('id');

const removeSection = isAdminResolver.createResolver(
  resolver,
);

export default removeSection;
