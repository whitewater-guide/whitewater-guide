import { Platform } from 'react-native';
import {
  acknowledgePurchaseAndroid,
  finishTransactionIOS,
  ProductPurchase,
} from 'react-native-iap';
import { trackError } from '../../../core/errors';
import { IAPError } from '../../../features/purchases';

const safeAcknowledgePurchase = async (purchase: ProductPurchase) => {
  try {
    if (Platform.OS === 'ios') {
      await finishTransactionIOS(purchase.transactionId!);
    } else {
      await acknowledgePurchaseAndroid(purchase.purchaseToken!);
    }
    return {
      error: undefined,
      acknowledged: true,
    };
  } catch (e) {
    const error = new IAPError(
      'screens:purchase.buy.errors.acknowledge',
      JSON.stringify({ error: e, purchase }, null, 2),
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
