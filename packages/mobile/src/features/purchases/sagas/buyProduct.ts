import { buyProductWithoutFinishTransaction, prepare, ProductPurchase } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';

export function *buyProduct(sku: string) {
  let purchase: ProductPurchase;
  try {
    yield call(prepare);
    purchase = yield call(buyProductWithoutFinishTransaction, sku);
  } catch (e) {
    trackError('iap', e);
  }
  return purchase;
}
