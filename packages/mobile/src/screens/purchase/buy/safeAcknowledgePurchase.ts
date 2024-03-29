import { Platform } from 'react-native';
import type { ProductPurchase } from 'react-native-iap';
import { finishTransaction } from 'react-native-iap';

import { trackError } from '~/core/errors';
import { IAPError } from '~/features/purchases';

const safeAcknowledgePurchase = async (purchase: ProductPurchase) => {
  try {
    // on android purchases are acknowledged server-side
    if (purchase.isAcknowledgedAndroid || Platform.OS === 'android') {
      return await Promise.resolve({
        error: undefined,
        acknowledged: true,
      });
    }
    await finishTransaction({ purchase });
    return {
      error: undefined,
      acknowledged: true,
    };
  } catch (e) {
    const error = new IAPError(
      'screens:purchase.buy.errors.acknowledge',
      JSON.stringify({ error: (e as Error).message, purchase }, null, 2),
      { transactionId: purchase.transactionId },
    );
    trackError('iap', e, { transactionId: purchase.transactionId });
    return {
      error,
      acknowledged: false,
    };
  }
};

export default safeAcknowledgePurchase;
