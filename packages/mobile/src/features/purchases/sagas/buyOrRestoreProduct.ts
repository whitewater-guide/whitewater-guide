import {
  buyProduct as buy,
  getAvailablePurchases,
  initConnection,
  Purchase,
} from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';
import { BuyProductResult } from '../types';

export function* buyOrRestoreProduct(sku: string) {
  const result: BuyProductResult = {};
  try {
    yield call(initConnection);
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
      const purchase = yield call(restorePurchase, sku);
      if (purchase) {
        result.purchase = purchase;
      }
    } else {
      trackError('iap', e);
      result.errorCode = e.code;
    }
  }
  return result;
}

export function* restorePurchase(sku: string) {
  const availablePurchases: Purchase[] = yield call(getAvailablePurchases);
  for (const purchase of availablePurchases) {
    if (purchase.productId === sku) {
      return purchase;
    }
  }
  return null;
}
