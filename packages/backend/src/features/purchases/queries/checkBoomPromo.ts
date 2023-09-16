import type { AuthenticatedQuery } from '../../../apollo/index';
import { isAuthenticatedResolver } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';

const checkBoomPromo: AuthenticatedQuery['checkBoomPromo'] = async (
  _,
  { code },
  context,
) => {
  const query = db()
    .table('boom_promos')
    .select([
      'boom_promos.code',
      'boom_promos.redeemed',
      'groups_view.name',
      'boom_promos.group_sku',
    ])
    .leftOuterJoin('groups_view', 'boom_promos.group_sku', 'groups_view.sku')
    .where('boom_promos.code', code)
    .andWhere((qb) => {
      qb.where('groups_view.language', context.language).orWhereNull(
        'boom_promos.group_sku',
      );
    })
    .first();
  const promo: (Sql.BoomPromos & { name: string | null }) | undefined =
    await query;
  if (!promo) {
    return null;
  }
  return {
    id: promo.code,
    code: promo.code,
    groupName: promo.name,
    groupSku: promo.group_sku,
    redeemed: promo.redeemed,
  };
};

export default isAuthenticatedResolver(checkBoomPromo);
