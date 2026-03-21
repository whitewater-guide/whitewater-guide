import type { MutationResolvers } from '../../../apollo/index';
import { isAuthenticatedResolver } from '../../../apollo/index';
import { db } from '../../../db/index';

const toggleFavoriteSection: MutationResolvers['toggleFavoriteSection'] =
  async (_, { id, favorite }, { user }) => {
    if (favorite) {
      await db()
        .insert({ user_id: user!.id, section_id: id })
        .into('fav_sections')
        .onConflict(['user_id', 'section_id'] as any)
        .ignore();
    } else {
      await db()
        .delete()
        .from('fav_sections')
        .where({ user_id: user!.id, section_id: id });
    }
    return { id, favorite };
  };

export default isAuthenticatedResolver(toggleFavoriteSection);
