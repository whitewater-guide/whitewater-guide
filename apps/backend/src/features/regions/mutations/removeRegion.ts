import type { MutationResolvers } from '../../../apollo/index';
import { MutationNotAllowedError } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeRegion: MutationResolvers['removeRegion'] = async (_, { id }) => {
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
  return result?.[0]?.id ?? null;
};

export default removeRegion;
