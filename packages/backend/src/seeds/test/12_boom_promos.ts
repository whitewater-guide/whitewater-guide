import Knex from 'knex';

export const BOOM_PROMO_REGION_ACTIVE = 'fbWYzB9y';
export const BOOM_PROMO_REGION_REDEEMED = '6UJPjFZc';
export const BOOM_PROMO_ALL_REGIONS_ACTIVE = 'YABy6CpH';
export const BOOM_PROMO_ALL_REGIONS_REDEEMED = 'Qo393hFL';
export const BOOM_PROMO_EU_CIS_ACTIVE = 'TjBM6Jgz';
export const BOOM_PROMO_EU_CIS_REDEEMED = 'BRQ8V5sw';

const promos = [
  {
    code: BOOM_PROMO_REGION_ACTIVE,
    redeemed: false,
    group_sku: null,
  },
  {
    code: BOOM_PROMO_REGION_REDEEMED,
    redeemed: true,
    group_sku: null,
  },
  {
    code: BOOM_PROMO_ALL_REGIONS_ACTIVE,
    redeemed: false,
    group_sku: 'group.all',
  },
  {
    code: BOOM_PROMO_ALL_REGIONS_REDEEMED,
    redeemed: true,
    group_sku: 'group.all',
  },
  {
    code: BOOM_PROMO_EU_CIS_ACTIVE,
    redeemed: false,
    group_sku: 'group.eu_cis',
  },
  {
    code: BOOM_PROMO_EU_CIS_REDEEMED,
    redeemed: true,
    group_sku: 'group.eu_cis',
  },
];

export async function seed(db: Knex) {
  await db.table('boom_promos').del();
  await db.table('boom_promos').insert(promos);
}
