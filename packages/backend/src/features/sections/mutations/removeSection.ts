import { GraphQLFieldResolver } from 'graphql';
import { baseResolver, Context } from '../../../apollo';
import db from '../../../db';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, Context> = async (root, { id }: Vars, { user }) => {
  await checkEditorPermissions(user, id);
  return db().table('sections').del().where({ id }).returning('id');
};

const removeSection = baseResolver.createResolver(
  resolver,
);

export default removeSection;
