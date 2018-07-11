import { buyProductWithoutFinishTransaction, prepare, ProductPurchase } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';

export function *buyProduct(sku: string) {
  let purchase: ProductPurchase;
  try {
    yield call(prepare);
    purchase = yield call(buyProductWithoutFinishTransaction, sku);
  } catch (e) {
    // Error examples
    // android.test.item_unavailable: { code: 'E_ITEM_UNAVAILABLE', message: 'That item is unavailable.'}
    // android.test.canceled: { code: 'E_UNKNOWN', message: 'Purchase failed with code: 0(OK)'}
    // android : { code: 'E_ALREADY_OWNED', message: 'You already own this item.'}
    // android : { code: 'E_SERVICE_ERROR', message: 'The service is unreachable. This may be your internet connection, or the Play Store may be down.'}
    trackError('iap', e);
  }
  return purchase;
}
