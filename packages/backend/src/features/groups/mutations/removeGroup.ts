import { baseResolver, NodeQuery } from '../../../apollo';
import db from '../../../db';

const removeGroup = baseResolver.createResolver(
  async (root, { id }: NodeQuery) => {
    const [result] = await db().table('groups').del().where({ id }).returning('id');
    return result;
  },
);

export default removeGroup;
