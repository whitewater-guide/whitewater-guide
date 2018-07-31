import { endConnection, getAvailablePurchases, getProducts, prepare, Product, Purchase } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { trackError } from '../../../core/errors';
import { PurchaseState, RestorableProduct } from '../types';
import update from './update';

export function* watchFetchProduct(action: Action<string>) {
  yield update({ error: null, product: null, state: PurchaseState.PRODUCT_LOADING });
  const product = yield call(fetchProduct, action.payload);
  yield update({
    product,
    state: product ? PurchaseState.IDLE : PurchaseState.PRODUCT_LOADING_FAILED,
    error: product ? null : 'iap:errors.fetchProduct',
  });
}

function* fetchProduct(sku: string) {
  let product: RestorableProduct | null = null;
  try {
    yield call(prepare);
    const products: Product[] = yield call(getProducts, [sku]);
    product = products[0];
    const availablePurchases: Purchase[] = yield call(getAvailablePurchases);
    for (const purchase of availablePurchases) {
      if (purchase.productId === sku) {
        // originalTransactionIdentifier is not in typedefs
        // @ts-ignore
        product.transactionId = purchase.originalTransactionIdentifier;
        break;
      }
    }
  } catch (e) {
    trackError('iap', e);
  } finally {
    yield call(endConnection);
  }
  return product || null;
}
