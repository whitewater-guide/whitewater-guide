import { baseResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }: Vars, { user }) => {
  await checkEditorPermissions(user, id);
  const { count: sectionsCount } = await db().table('sections').where({ river_id: id }).count().first();
  if (sectionsCount > 0) {
    throw new MutationNotAllowedError({ message: 'Delete all sections first!' });
  }
  return db().table('rivers').del().where({ id }).returning('id');
};

const removeRiver = baseResolver.createResolver(
  resolver,
);

export default removeRiver;
