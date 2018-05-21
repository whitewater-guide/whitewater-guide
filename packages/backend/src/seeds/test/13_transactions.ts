import Knex from 'knex';
import { TransactionRaw } from '../../features/purchases';
import { PurchasePlatform } from '../../ww-commons';
import { BOOM_USER_1500_ID, BOOM_USER_3500_ID, TEST_USER_ID } from './01_users';
import {
  BOOM_PROMO_ALL_REGIONS_REDEEMED,
  BOOM_PROMO_EU_CIS_REDEEMED,
  BOOM_PROMO_REGION_REDEEMED,
} from './12_boom_promos';

const transactions: Array<Partial<TransactionRaw>> = [
  {
    id: 'df03a400-5cc3-11e8-9c2d-fa7ae01bbebc',
    user_id: TEST_USER_ID,
    platform: PurchasePlatform.boomstarter,
    transaction_id: BOOM_PROMO_REGION_REDEEMED,
    product_id: 'region.georgia',
    validated: true,
  },
  {
    id: 'ba830f5c-5d00-11e8-9c2d-fa7ae01bbebc',
    user_id: BOOM_USER_3500_ID,
    platform: PurchasePlatform.boomstarter,
    transaction_id: BOOM_PROMO_ALL_REGIONS_REDEEMED,
    product_id: 'group.all',
    validated: true,
  },
  {
    id: '06688f00-5d01-11e8-9c2d-fa7ae01bbebc',
    user_id: BOOM_USER_1500_ID,
    platform: PurchasePlatform.boomstarter,
    transaction_id: BOOM_PROMO_EU_CIS_REDEEMED,
    product_id: 'group.eu_cis',
    validated: true,
  },
];

export async function seed(db: Knex) {
  await db.table('transactions').del();
  await db.table('transactions').insert(transactions);
}
