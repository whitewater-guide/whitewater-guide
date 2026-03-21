import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeTag: MutationResolvers['removeTag'] = async (_, { id }) => {
  const [result] = await db().table('tags').del().where({ id }).returning('id');
  return result?.id;
};

export default removeTag;
