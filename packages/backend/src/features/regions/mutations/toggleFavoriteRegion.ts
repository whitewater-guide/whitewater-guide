import { isAuthenticatedResolver, MutationResolvers } from '~/apollo';
import { db } from '~/db';

const toggleFavoriteRegion: MutationResolvers['toggleFavoriteRegion'] = async (
  _,
  { id, favorite },
  { user },
) => {
  if (favorite) {
    await db()
      .insert({ user_id: user!.id, region_id: id })
      .into('fav_regions')
      .onConflict(['user_id', 'region_id'] as any)
      .ignore();
  } else {
    await db()
      .delete()
      .from('fav_regions')
      .where({ user_id: user!.id, region_id: id });
  }
  return favorite;
};

export default isAuthenticatedResolver(toggleFavoriteRegion);
