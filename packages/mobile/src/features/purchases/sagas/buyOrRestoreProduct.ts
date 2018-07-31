import { buyProduct as buy, prepare } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';
import { BuyProductResult } from '../types';

export function *buyProduct(sku: string) {
  const result: BuyProductResult = {};
  try {
    yield call(prepare);
    result.purchase = yield call(buy, sku);
  } catch (e) {
    // Error examples
    // android.test.item_unavailable: { code: 'E_ITEM_UNAVAILABLE', message: 'That item is unavailable.'}
    // android.test.canceled: { code: 'E_UNKNOWN', message: 'Purchase failed with code: 0(OK)'}
    // android : { code: 'E_ALREADY_OWNED', message: 'You already own this item.'}
    // android : { code: 'E_SERVICE_ERROR', message: 'The service is unreachable. This may be your internet connection, or the Play Store may be down.'}
    // android : { code: 'E_USER_CANCELLED', message: 'Cancelled.'}
    if (e.code === 'E_USER_CANCELLED') {
      result.canceled = true;
    } else if (e.code === 'E_ALREADY_OWNED') {
      result.alreadyOwned = true;
    } else {
      trackError('iap', e);
      result.errorCode = e.code;
    }
  }
  return result;
}

export function *restorePurchase(sku: string) {

}