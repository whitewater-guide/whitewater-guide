import db, { holdTransaction, rollbackTransaction } from '@db';
import { BOOM_USER_3500, BOOM_USER_3500_ID, TEST_USER } from '@seeds/01_users';
import {
  BOOM_PROMO_EU_CIS_ACTIVE,
  BOOM_PROMO_LATIN_REDEEMED,
  BOOM_PROMO_REGION_ACTIVE,
  BOOM_PROMO_REGION_REDEEMED,
} from '@seeds/12_boom_promos';
import { anonContext, fakeContext, runQuery, UUID_REGEX } from '@test';
import { PurchaseInput, PurchasePlatform } from '@ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
  mutation addPurchase($purchase: PurchaseInput!) {
    addPurchase(purchase: $purchase)
  }
`;

it('anon should fail', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_ACTIVE,
    productId: 'region.georgia',
  };
  const result = await runQuery(mutation, { purchase }, anonContext());
  expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
  expect(result).toHaveProperty('data.addPurchase', null);
});

it('duplicate purchase should return false when for same user', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_REDEEMED,
    productId: 'region.norway', // different region from already redeemed, but should not matter
  };
  const result = await runQuery(mutation, { purchase }, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.addPurchase', false);
});

it('duplicate purchase should return throw when for different user', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_REDEEMED,
    productId: 'region.norway', // different region from already redeemed, but should not matter
  };
  const result = await runQuery(mutation, { purchase }, fakeContext(BOOM_USER_3500));
  expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
  expect(result).toHaveProperty('errors.0.message', 'Duplicate transaction');
  expect(result).toHaveProperty('data.addPurchase', null);
});

it('should throw on invalid input', async () => {
  const purchase = {
    platform: 'wrong',
    transactionId: 'x',
    productId: 'y',
  };
  const result = await runQuery(mutation, { purchase }, fakeContext(TEST_USER));
  expect(result).toHaveProperty('errors.0.name', 'ValidationError');
  expect(result).toHaveProperty('data.addPurchase', null);
  expect((result.errors![0] as any).data).toMatchSnapshot();
});

describe('boomstarter', () => {
  it('should throw error for non-existing promo code', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: 'xxxxxxxx',
      productId: 'region.norway',
    };
    const result = await runQuery(mutation, { purchase }, fakeContext(BOOM_USER_3500));
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Bad promo code');
    expect(result).toHaveProperty('data.addPurchase', null);
  });

  it('should throw error when promo code and product do not match', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: BOOM_PROMO_EU_CIS_ACTIVE,
      productId: 'region.norway',
    };
    const result = await runQuery(mutation, { purchase }, fakeContext(BOOM_USER_3500));
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Promo code and product do not match');
    expect(result).toHaveProperty('data.addPurchase', null);
  });

  it('should throw error for used promo code', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: BOOM_PROMO_LATIN_REDEEMED,
      productId: 'group.latin',
    };
    const result = await runQuery(mutation, { purchase }, fakeContext(BOOM_USER_3500));
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Promo code already redeemed');
    expect(result).toHaveProperty('data.addPurchase', null);
  });

  describe('success', () => {
    let result: any;

    beforeEach(async () => {
      const purchase: PurchaseInput = {
        platform: PurchasePlatform.boomstarter,
        transactionId: BOOM_PROMO_EU_CIS_ACTIVE,
        productId: 'group.eu_cis',
      };
      result = await runQuery(mutation, { purchase }, fakeContext(BOOM_USER_3500));
    });

    it('should return true for correct promo code', () => {
      expect(result.errors).toBeUndefined();
      expect(result).toHaveProperty('data.addPurchase', true);
    });

    it('should save transaction', async () => {
      const transactions = await db().table('transactions').where({ transaction_id: BOOM_PROMO_EU_CIS_ACTIVE });
      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        id: expect.stringMatching(UUID_REGEX),
        user_id: BOOM_USER_3500_ID,
        platform: PurchasePlatform.boomstarter,
        transaction_date: null,
        transaction_id: BOOM_PROMO_EU_CIS_ACTIVE,
        product_id: 'group.eu_cis',
        receipt: null,
        validated: true,
        extra: null,
      });
    });

    it('should mark promo code as redeemed', async () => {
      const promo = await db().table('boom_promos').where({ code: BOOM_PROMO_EU_CIS_ACTIVE }).first();
      expect(promo).toMatchObject({
        code: BOOM_PROMO_EU_CIS_ACTIVE,
        group_sku: 'group.eu_cis',
        redeemed: true,
      });
    });

  });

});
