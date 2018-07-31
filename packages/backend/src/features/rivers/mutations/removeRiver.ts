import { baseResolver, MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }: Vars, { user, dataSources }) => {
  await dataSources.rivers.assertEditorPermissions(id);
  const { count: sectionsCount } = await db().table('sections').where({ river_id: id }).count().first();
  if (sectionsCount > 0) {
    throw new MutationNotAllowedError({ message: 'Delete all sections first!' });
  }
  const result = await db().table('rivers').del().where({ id }).returning('id');
  return (result && result.length) ? result[0] : null;
};

const removeRiver = baseResolver.createResolver(
  resolver,
);

export default removeRiver;
