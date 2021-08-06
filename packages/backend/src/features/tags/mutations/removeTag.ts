import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

const removeTag: MutationResolvers['removeTag'] = async (_, { id }) => {
  const [result] = await db().table('tags').del().where({ id }).returning('id');
  return result;
};

export default removeTag;
