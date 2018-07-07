import { Platform } from 'react-native';
import {
  buyProductWithoutFinishTransaction,
  consumeAllItems,
  endConnection,
  finishTransaction,
  prepare,
  ProductPurchase
} from 'react-native-iap';
import { apply, call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { getApolloClient } from '../../../core/apollo';
import { trackError } from '../../../core/errors';
import isApolloOfflineError from '../../../utils/isApolloOfflineError';
import { PurchaseInput, PurchasePlatform } from '../../../ww-commons';
import { purchaseActions } from '../actions';
import { PurchaseState } from '../types';
import { ADD_PURCHASE_MUTATION } from './addPurchase.mutation';
import update from './update';

export function* purchaseProduct(action: Action<string>) {
  yield update({ error: null, state: PurchaseState.PRODUCT_PURCHASING });
  try {
    yield call(prepare);
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.prepare', state: PurchaseState.IDLE });
    return;
  }

  let purchase!: ProductPurchase;

  try {
    purchase = yield call(buyProductWithoutFinishTransaction, action.payload);
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.buy', state: PurchaseState.IDLE });
    yield finalize();
    return;
  }

  try {
    yield update({ state: PurchaseState.PRODUCT_VALIDATING });
    const client = getApolloClient();
    const info: PurchaseInput = {
      platform: Platform.select({ ios: PurchasePlatform.ios, android: PurchasePlatform.android }),
      productId: purchase.productId,
      transactionId: purchase.transactionId,
      transactionDate: new Date(purchase.transactionDate),
      receipt: purchase.transactionReceipt,
      extra: purchase,
    };
    // false for duplicate purchases, unless purchase is for different user. In this case throws
    const { errors } = yield apply(client, client.mutate, [{
      mutation: ADD_PURCHASE_MUTATION,
      variables: { info },
    }]);
    if (errors) {
      yield update({
        error: ['iap:errors.addPurchaseInvalid', { transactionId: purchase.transactionId }],
        state: PurchaseState.IDLE,
      });
    } else {
      yield update({ state: PurchaseState.IDLE });
    }
  } catch (e) {
    // Failed to deliver transaction to backend, put to offline queue
    if (isApolloOfflineError(e)) {
      yield update({
        error: ['iap:errors.addPurchaseOffline', { transactionId: purchase.transactionId }],
      });
      yield put(purchaseActions.saveReceipt(purchase));
    } else {
      yield update({
        error: ['iap:errors.addPurchase', { transactionId: purchase.transactionId }],
        state: PurchaseState.IDLE,
      });
    }
  } finally {
    yield call(finishTransaction); // ios-only, handles offline on native level
    try {
      yield call(consumeAllItems); // android-only, can throw
    } catch {
      /// ignore
    }
  }

  yield finalize();
}

export function* finalize() {
  try {
    yield call(endConnection);
  } catch (e) {
    trackError('iap', e);
    yield update({ error: 'iap:errors.endConnection', state: PurchaseState.IDLE });
  }
}
