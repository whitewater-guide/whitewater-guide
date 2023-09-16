import type { MutationResolvers } from '../../../apollo/index';
import { MutationNotAllowedError } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeRiver: MutationResolvers['removeRiver'] = async (
  _,
  { id },
  { dataSources },
) => {
  await dataSources.users.assertEditorPermissions({ riverId: id });
  const { count: sectionsCount } = await db()
    .table('sections')
    .where({ river_id: id })
    .count()
    .first();
  if (sectionsCount > 0) {
    throw new MutationNotAllowedError('Delete all sections first!');
  }
  const result = await db().table('rivers').del().where({ id }).returning('id');
  return result?.[0].id ?? null;
};

export default removeRiver;
