import {
  endConnection,
  getProducts,
  initConnection,
  Product,
} from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { trackError } from '../../../core/errors';
import { PurchaseState } from '../types';
import update from './update';

export function* watchFetchProduct(action: Action<string>) {
  yield update({
    error: null,
    product: null,
    state: PurchaseState.PRODUCT_LOADING,
  });
  const product = yield call(fetchProduct, action.payload);
  yield update({
    product,
    state: product ? PurchaseState.IDLE : PurchaseState.PRODUCT_LOADING_FAILED,
    error: product ? null : 'iap:errors.fetchProduct',
  });
}

function* fetchProduct(sku: string) {
  let product: Product<string> | null = null;
  try {
    yield call(initConnection);
    const products: Array<Product<string>> = yield call(getProducts, [sku]);
    product = products[0] || null;
  } catch (e) {
    trackError('iap', e);
  } finally {
    yield call(endConnection);
  }
  return product || null;
}
