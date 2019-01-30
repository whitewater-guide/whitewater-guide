import { MutationNotAllowedError, NodeQuery, TopLevelResolver } from '@apollo';
import db from '@db';

const removeGroup: TopLevelResolver = async (root, { id }: NodeQuery) => {
  const { all_regions } = await db()
    .table('groups')
    .select(['all_regions'])
    .where({ id })
    .first();
  if (all_regions) {
    throw new MutationNotAllowedError('Cannot delete this group');
  }
  const [result] = await db()
    .table('groups')
    .del()
    .where({ id })
    .returning('id');
  return result;
};

export default removeGroup;
