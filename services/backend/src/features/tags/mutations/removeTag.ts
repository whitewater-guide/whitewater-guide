import { NodeQuery, TopLevelResolver } from '~/apollo';
import db from '~/db';

const removeTag: TopLevelResolver<NodeQuery> = async (
  root,
  { id }: NodeQuery,
) => {
  const [result] = await db()
    .table('tags')
    .del()
    .where({ id })
    .returning('id');
  return result;
};

export default removeTag;
