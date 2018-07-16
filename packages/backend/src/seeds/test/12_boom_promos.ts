import Knex from 'knex';

export const BOOM_PROMO_REGION_ACTIVE = 'fbWYzB9y';
export const BOOM_PROMO_REGION_REDEEMED = '6UJPjFZc';
export const BOOM_PROMO_REGION_REDEEMED2 = 'MtNVwMsz';
export const BOOM_PROMO_ALL_REGIONS_ACTIVE = 'YABy6CpH';
export const BOOM_PROMO_ALL_REGIONS_REDEEMED = 'Qo393hFL';
export const BOOM_PROMO_EU_CIS_ACTIVE = 'TjBM6Jgz';
export const BOOM_PROMO_EU_CIS_REDEEMED = 'BRQ8V5sw';
export const BOOM_PROMO_LATIN_ACTIVE = 'KExhXzwv';
export const BOOM_PROMO_LATIN_REDEEMED = 'MtNVwMas';

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
    code: BOOM_PROMO_REGION_REDEEMED2,
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
  {
    code: BOOM_PROMO_LATIN_ACTIVE,
    redeemed: false,
    group_sku: 'group.latin',
  },
  {
    code: BOOM_PROMO_LATIN_REDEEMED,
    redeemed: true,
    group_sku: 'group.latin',
  },
];

export async function seed(db: Knex) {
  await db.table('boom_promos').del();
  await db.table('boom_promos').insert(promos);
}
