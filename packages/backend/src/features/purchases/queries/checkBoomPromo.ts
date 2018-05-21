import { Context, isAuthenticatedResolver } from '../../../apollo';
import db from '../../../db/db';
import { BoomPromoRaw } from '../types';

interface Vars {
  code: string;
}

const media = isAuthenticatedResolver.createResolver(
  async (_, { code }: Vars, context: Context) => {
    const query = db()
      .table('boom_promos')
      .select(['boom_promos.code', 'boom_promos.redeemed', 'groups_view.name'])
      .leftOuterJoin('groups_view', 'boom_promos.group_sku', 'groups_view.sku')
      .where('boom_promos.code', code)
      .andWhere((qb) => {
        qb.where('groups_view.language', context.language)
          .orWhereNull('boom_promos.group_sku');
      })
      .first();
    const promo: BoomPromoRaw & { name: string | null} | undefined = await query;
    if (!promo) {
      return null;
    }
    return {
      id: promo.code,
      code: promo.code,
      groupName: promo.name,
      redeemed: promo.redeemed,
    };
  },
);

export default media;
