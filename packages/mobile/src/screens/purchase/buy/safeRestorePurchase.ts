import { getAvailablePurchases } from 'react-native-iap';

import { trackError } from '~/core/errors';
import { IAPError } from '~/features/purchases';

const safeRestorePurchase = async (sku: string) => {
  try {
    const purchases = await getAvailablePurchases();
    for (const purchase of purchases) {
      if (purchase.productId === sku) {
        return {
          purchase,
          error: undefined,
        };
      }
    }
    return {
      purchase: undefined,
      error: new IAPError(
        'screens:purchase.buy.errors.restoreNotFound',
        `sku: ${sku}`,
        { sku },
      ),
    };
  } catch (e) {
    const error = new IAPError(
      'screens:purchase.buy.errors.restoreFailed',
      (e as Error).message,
    );
    trackError('iap', e);
    return {
      purchase: undefined,
      error,
    };
  }
};

export default safeRestorePurchase;
