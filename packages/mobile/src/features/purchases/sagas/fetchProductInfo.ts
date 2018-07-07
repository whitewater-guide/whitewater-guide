import { endConnection, getProducts, prepare, Product } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { trackError } from '../../../core/errors';
import { PurchaseState } from '../types';
import update from './update';

export function* fetchProductInfo(action: Action<string>) {
  yield update({ error: null, product: null, state: PurchaseState.PRODUCT_LOADING });
  try {
    yield call(prepare);
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.prepare', product: null, state: PurchaseState.IDLE });
    return;
  }

  try {
    const products: Product[] = yield call(getProducts, [action.payload]);
    if (products.length === 0) {
      yield update({ error: 'iap:errors.productNotFound', product: null, state: PurchaseState.IDLE });
    } else {
      yield update({ error: 'iap:errors.productNotFound', product: products[0], state: PurchaseState.IDLE });
    }
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.getProducts', product: null, state: PurchaseState.IDLE });
  }

  try {
    yield call(endConnection);
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.endConnection', product: null, state: PurchaseState.IDLE });
  }
}
