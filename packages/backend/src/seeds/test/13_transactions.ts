import Knex from 'knex';
import { TransactionRaw } from '../../features/purchases/types';
import { PurchasePlatform } from '../../ww-commons';
import { TEST_USER_ID } from './01_users';
import { BOOM_PROMO_REGION_REDEEMED } from './12_boom_promos';

const transactions: Array<Partial<TransactionRaw>> = [
  {
    id: 'df03a400-5cc3-11e8-9c2d-fa7ae01bbebc',
    user_id: TEST_USER_ID,
    platform: PurchasePlatform.boomstarter,
    transaction_id: BOOM_PROMO_REGION_REDEEMED,
    product_id: 'region.georgia',
    validated: true,
  },
];

export async function seed(db: Knex) {
  await db.table('transactions').del();
  await db.table('transactions').insert(transactions);
}
