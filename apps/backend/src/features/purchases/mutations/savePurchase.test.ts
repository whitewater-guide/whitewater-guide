import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { PurchaseInput } from '@whitewater-guide/schema';
import { PurchasePlatform } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  BOOM_USER_3500,
  BOOM_USER_3500_ID,
  TEST_USER,
  TEST_USER2,
} from '../../../seeds/test/01_users';
import {
  REGION_ECUADOR,
  REGION_GEORGIA,
  REGION_NORWAY,
} from '../../../seeds/test/04_regions';
import { GEORGIA_BZHUZHA_EXTREME } from '../../../seeds/test/09_sections';
import {
  BOOM_PROMO_EU_CIS_ACTIVE,
  BOOM_PROMO_LATIN_REDEEMED,
  BOOM_PROMO_REGION_ACTIVE,
  BOOM_PROMO_REGION_REDEEMED,
} from '../../../seeds/test/12_boom_promos';
import { anonContext, fakeContext } from '../../../test/index';
import { UUID_REGEX } from '../../../utils/index';
import {
  testSavePurchase,
  testSavePurchaseNoSection,
} from './savePurchase.test.generated';
import {
  acknowledgeAndroid,
  isAppleReceiptVerified,
  verifyAppleReceipt,
} from './utils';

jest.mock('./utils');

beforeEach(async () => {
  await holdTransaction();
  jest.resetAllMocks();
  (verifyAppleReceipt as jest.Mock).mockResolvedValue({
    receipt: { foo: 'bar' },
    status: 0,
  });
  (isAppleReceiptVerified as jest.Mock).mockReturnValue(true);
  (acknowledgeAndroid as jest.Mock).mockResolvedValue(undefined);
});
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation savePurchase($purchase: PurchaseInput!, $sectionId: ID) {
    savePurchase(purchase: $purchase, sectionId: $sectionId) {
      regions {
        id
        sku
        hasPremiumAccess
      }
      section {
        id
        description
      }
    }
  }
`;

const _mutationWOSection = gql`
  mutation savePurchaseNoSection($purchase: PurchaseInput!) {
    savePurchase(purchase: $purchase) {
      regions {
        id
        sku
        hasPremiumAccess
      }
    }
  }
`;

it('anon should fail', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_ACTIVE,
    productId: 'region.georgia',
  };
  const result = await testSavePurchase({ purchase }, anonContext());
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('duplicate purchase should not fail for same user', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_REDEEMED,
    productId: 'region.ecuador', // different region from already redeemed, but should not matter
  };
  const result = await testSavePurchase({ purchase }, fakeContext(TEST_USER));
  expect(result.errors).toBeUndefined();
  expect(result.data?.savePurchase).toBeTruthy();
});

it('duplicate purchase should throw when for different user', async () => {
  const purchase: PurchaseInput = {
    platform: PurchasePlatform.boomstarter,
    transactionId: BOOM_PROMO_REGION_REDEEMED,
    productId: 'region.norway', // different region from already redeemed, but should not matter
  };
  const result = await testSavePurchase(
    { purchase },
    fakeContext(BOOM_USER_3500),
  );
  expect(result).toHaveGraphqlError(
    ApolloErrorCodes.MUTATION_NOT_ALLOWED,
    'Duplicate transaction',
  );
});

it('should throw on invalid input', async () => {
  const purchase = {
    platform: 'wrong',
    transactionId: 'x',
    productId: 'y',
  };
  const result = await testSavePurchase({ purchase }, fakeContext(TEST_USER));
  expect(result).toHaveGraphqlValidationError();
});

describe('boomstarter', () => {
  it('should throw error for non-existing promo code', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: 'xxxxxxxx',
      productId: 'region.norway',
    };
    const result = await testSavePurchase(
      { purchase },
      fakeContext(BOOM_USER_3500),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Bad promo code',
    );
  });

  it('should throw error when promo code and product do not match', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: BOOM_PROMO_EU_CIS_ACTIVE,
      productId: 'region.norway',
    };
    const result = await testSavePurchase(
      { purchase },
      fakeContext(BOOM_USER_3500),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Promo code and product do not match',
    );
  });

  it('should throw error for used promo code', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: BOOM_PROMO_LATIN_REDEEMED,
      productId: 'group.latin',
    };
    const result = await testSavePurchase(
      { purchase },
      fakeContext(BOOM_USER_3500),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Promo code already redeemed',
    );
  });

  describe('success', () => {
    let result: any;

    beforeEach(async () => {
      const purchase: PurchaseInput = {
        platform: PurchasePlatform.boomstarter,
        transactionId: BOOM_PROMO_EU_CIS_ACTIVE,
        productId: 'group.eu_cis',
      };
      result = await testSavePurchase(
        { purchase },
        fakeContext(BOOM_USER_3500),
      );
    });

    it('should return regions correct promo code', () => {
      expect(result.errors).toBeUndefined();
      expect(result.data.savePurchase).toEqual({
        regions: [
          {
            id: REGION_GEORGIA,
            sku: 'region.georgia',
            hasPremiumAccess: true,
          },
        ],
        section: null,
      });
      // because Norway is hidden
      expect(result.data.savePurchase.regions).not.toContainEqual(
        expect.objectContaining({
          id: REGION_NORWAY,
        }),
      );
    });

    it('should save transaction', async () => {
      const transactions = await db()
        .table('transactions')
        .where({ transaction_id: BOOM_PROMO_EU_CIS_ACTIVE });
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
      const promo = await db()
        .table('boom_promos')
        .where({ code: BOOM_PROMO_EU_CIS_ACTIVE })
        .first();
      expect(promo).toMatchObject({
        code: BOOM_PROMO_EU_CIS_ACTIVE,
        group_sku: 'group.eu_cis',
        redeemed: true,
      });
    });
  });
});

describe('ios', () => {
  it('should return single region with section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.ios,
      transactionId: '__transaction_id__',
      productId: 'region.ecuador',
      receipt: '{}',
    };
    const result = await testSavePurchase(
      { purchase },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase?.regions).toEqual([
      {
        id: REGION_ECUADOR,
        sku: 'region.ecuador',
        hasPremiumAccess: true,
      },
    ]);
  });

  it('should return single region without section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.ios,
      transactionId: '__transaction_id__',
      productId: 'region.ecuador',
      receipt: '{}',
    };
    const result = await testSavePurchaseNoSection(
      { purchase },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase?.regions).toEqual([
      {
        id: REGION_ECUADOR,
        sku: 'region.ecuador',
        hasPremiumAccess: true,
      },
    ]);
  });

  it('should return single region and section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.ios,
      transactionId: '__transaction_id__',
      productId: 'region.georgia',
      receipt: '{}',
    };
    const result = await testSavePurchase(
      { purchase, sectionId: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase).toEqual({
      regions: [
        {
          id: REGION_GEORGIA,
          sku: 'region.georgia',
          hasPremiumAccess: true,
        },
      ],
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        description: 'Bzhuzha Extreme race description',
      },
    });
  });
});

describe('android', () => {
  it('should return single region with section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.android,
      transactionId: '__transaction_id__',
      productId: 'region.ecuador',
      receipt:
        '{"packageName": "guide.whitewater", "productId": "region.ecuador", "purchaseToken": "someToken"}',
    };
    const result = await testSavePurchase(
      { purchase },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase?.regions).toEqual([
      {
        id: REGION_ECUADOR,
        sku: 'region.ecuador',
        hasPremiumAccess: true,
      },
    ]);
  });

  it('should return single region without section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.android,
      transactionId: '__transaction_id__',
      productId: 'region.ecuador',
      receipt:
        '{"packageName": "guide.whitewater", "productId": "region.ecuador", "purchaseToken": "someToken"}',
    };
    const result = await testSavePurchaseNoSection(
      { purchase },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase?.regions).toEqual([
      {
        id: REGION_ECUADOR,
        sku: 'region.ecuador',
        hasPremiumAccess: true,
      },
    ]);
  });

  it('should return single region and section', async () => {
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.android,
      transactionId: '__transaction_id__',
      productId: 'region.georgia',
      receipt:
        '{"packageName": "guide.whitewater", "productId": "region.georgia", "purchaseToken": "someToken"}',
    };
    const result = await testSavePurchase(
      { purchase, sectionId: GEORGIA_BZHUZHA_EXTREME },
      fakeContext(TEST_USER2),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.savePurchase).toEqual({
      regions: [
        {
          id: REGION_GEORGIA,
          sku: 'region.georgia',
          hasPremiumAccess: true,
        },
      ],
      section: {
        id: GEORGIA_BZHUZHA_EXTREME,
        description: 'Bzhuzha Extreme race description',
      },
    });
  });
});
