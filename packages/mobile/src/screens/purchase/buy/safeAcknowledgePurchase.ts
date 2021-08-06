import { Platform } from 'react-native';
import { finishTransaction, InAppPurchase } from 'react-native-iap';

import { trackError } from '../../../core/errors';
import { IAPError } from '../../../features/purchases';

const safeAcknowledgePurchase = async (purchase: InAppPurchase) => {
  try {
    // on android purchases are acknowledged server-side
    if (purchase.isAcknowledgedAndroid || Platform.OS === 'android') {
      return await Promise.resolve({
        error: undefined,
        acknowledged: true,
      });
    }
    await finishTransaction(purchase);
    return {
      error: undefined,
      acknowledged: true,
    };
  } catch (e) {
    const error = new IAPError(
      'screens:purchase.buy.errors.acknowledge',
      JSON.stringify({ error: e.message, purchase }, null, 2),
      { transactionId: purchase.transactionId },
    );
    trackError('iap', error);
    return {
      error,
      acknowledged: false,
    };
  }
};

export default safeAcknowledgePurchase;
