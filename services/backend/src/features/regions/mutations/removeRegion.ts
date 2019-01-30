import { MutationNotAllowedError, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  id: string;
}

const removeRegion: TopLevelResolver<Vars> = async (root, { id }) => {
  const [{ count }] = await db()
    .table('rivers')
    .count('*')
    .where({ region_id: id });
  if (Number(count) !== 0) {
    throw new MutationNotAllowedError('Delete the rivers first');
  }
  const result = await db()
    .table('regions')
    .del()
    .where({ id })
    .returning('id');
  return result && result.length ? result[0] : null;
};

export default removeRegion;
