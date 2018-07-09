import { finishTransaction, ProductPurchase, } from 'react-native-iap';
import { call, put, race, take } from 'redux-saga/effects';
import { Action, isType } from 'typescript-fsa';
import { auth } from '../../../core/auth';
import { purchaseActions } from '../actions';
import { PurchaseState, RefreshPremiumResult, SavePurchaseResult } from '../types';
import { buyProduct } from './buyProduct';
import { finishPurchase } from './finishPurchase';
import { refreshPremium } from './refreshPremium';
import savePurchase from './savePurchase';
import update from './update';

export function* watchBuyProduct(action: Action<string>) {
  // Step 1. Refresh premium, redirect to different dialog screen if not logged in or already has this region
  yield update({ error: null, product: null, state: PurchaseState.REFRESHING_PREMIUM });
  const status = yield call(refreshPremium);
  switch (status) {
    case RefreshPremiumResult.ERROR:
      yield update({ error: 'iap:errors.refreshPremium', state: PurchaseState.REFRESHING_PREMIUM_FAILED });
      return;
    case RefreshPremiumResult.PURCHASED:
      yield update({ state: PurchaseState.IDLE, dialogStep: 'AlreadyHave' });
      return;
    case RefreshPremiumResult.NOT_LOGGED_IN:
      yield update({ state: PurchaseState.IDLE, dialogStep: 'Auth' });
      return;
  }

  // Step 2: Purchase product via react-native-iap
  yield update({ state: PurchaseState.PRODUCT_PURCHASING });
  const purchase: ProductPurchase | undefined = yield call(buyProduct, action.payload);
  if (!purchase) {
    yield update({ error: 'iap:errors.buyProduct', state: PurchaseState.PRODUCT_PURCHASING_FAILED });
    yield call(finishPurchase);
    return;
  }

  // Step 3: validate purchase (save transaction to backend)
  yield update({ state: PurchaseState.PURCHASE_SAVING });
  const saveResult = yield call(savePurchase, purchase);
  switch (saveResult) {
    case SavePurchaseResult.ERROR:
      // Fatal failure: e.g. this transaction is already used by different user
      yield update({
        error: ['iap:errors.savePurchase', { transactionId: purchase.transactionId }],
        state: PurchaseState.PURCHASE_SAVING_FATAL,
      });
      break;
    case SavePurchaseResult.SUCCESS:
      yield update({ state: PurchaseState.IDLE, dialogStep: 'Success' });
      break;
    case SavePurchaseResult.OFFLINE:
      yield update({
        error: ['iap:errors.savePurchaseOffline', { transactionId: purchase.transactionId }],
        state: PurchaseState.PURCHASE_SAVING_OFFLINE,
      });
      yield put(purchaseActions.saveOfflinePurchase(purchase));
      // Now wait until either user logs out, or offline purchase gets saved
      yield call(waitUntilOfflinePurchaseRemoved, purchase);
  }

  yield call(finishTransaction);
}

export function *waitUntilOfflinePurchaseRemoved(purchase: ProductPurchase) {
  const { saved } = yield race({
    saved: take((a: any) =>
      isType(a, purchaseActions.removeOfflinePurchase) && a.payload.purchase.transactionId === purchase.transactionId,
    ),
    logout: take(auth.logout),
  });
  if (saved) {
    if (saved.success) {
      yield update({ state: PurchaseState.IDLE, dialogStep: 'Success' });
    } else {
      yield update({
        error: ['iap:errors.savePurchase', { transactionId: purchase.transactionId }],
        state: PurchaseState.PURCHASE_SAVING_FATAL,
      });
    }
  }
}