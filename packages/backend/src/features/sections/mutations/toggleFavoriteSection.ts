import { isAuthenticatedResolver, MutationResolvers } from '~/apollo';
import { db } from '~/db';

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
    return favorite;
  };

export default isAuthenticatedResolver(toggleFavoriteSection);
