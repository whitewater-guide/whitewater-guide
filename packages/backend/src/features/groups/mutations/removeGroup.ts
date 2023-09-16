import type { MutationResolvers } from '../../../apollo/index';
import { MutationNotAllowedError } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeGroup: MutationResolvers['removeGroup'] = async (_, { id }) => {
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
  return result?.id;
};

export default removeGroup;
