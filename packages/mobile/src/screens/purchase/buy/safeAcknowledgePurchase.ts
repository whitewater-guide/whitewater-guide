import { finishTransaction, ProductPurchase } from 'react-native-iap';
import { trackError } from '../../../core/errors';
import { IAPError } from '../../../features/purchases';

const safeAcknowledgePurchase = async (purchase: ProductPurchase) => {
  try {
    await finishTransaction(purchase.transactionId!);
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
