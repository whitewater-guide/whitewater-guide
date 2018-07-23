import { ProductPurchase } from 'react-native-iap';
import { call, put, race, select, take } from 'redux-saga/effects';
import { Action, isType } from 'typescript-fsa';
import { auth } from '../../../core/auth';
import { RootState } from '../../../core/reducers';
import { purchaseActions } from '../actions';
import { BuyProductResult, PurchaseState, RefreshPremiumResult, RestorableProduct, SavePurchaseResult } from '../types';
import { buyProduct } from './buyProduct';
import { finishPurchase } from './finishPurchase';
import { refreshPremium } from './refreshPremium';
import savePurchase from './savePurchase';
import update from './update';

export function* watchBuyProduct(action: Action<string>) {
  // Step 1. Refresh premium, redirect to different dialog screen if not logged in or already has this region
  yield update({ error: null, state: PurchaseState.REFRESHING_PREMIUM });
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

  // Step 2: If user is logged in on iOS, and our backend says that he doesn't own this product, but
  // react-native-iap says that he owns it (via restore purchases mechanism)
  // TODO: better approach would be to use restored purchase as secondary source of truth
  // this will require backend to always send description
  const product: (RestorableProduct | null) = yield select((state: RootState) => state.purchase.product);
  if (product && product.transactionId) {
    yield update({
      error: ['iap:errors.alreadyOwned', { transactionId: product.transactionId }],
      state: PurchaseState.PURCHASE_SAVING_FATAL,
    });
    yield call(finishPurchase);
    return;
  }

  // Step 3: Purchase product via react-native-iap
  yield update({ state: PurchaseState.PRODUCT_PURCHASING });
  const { purchase, canceled, alreadyOwned }: BuyProductResult = yield call(buyProduct, action.payload);
  if (canceled) {
    yield update({ error: null, state: PurchaseState.IDLE });
    yield call(finishPurchase);
    return;
  } else if (alreadyOwned) {
    yield update({
      error: ['iap:errors.alreadyOwned', { transactionId: product.transactionId }],
      state: PurchaseState.PURCHASE_SAVING_FATAL,
    });
    yield call(finishPurchase);
    return;
  } else if (!purchase) {
    yield update({ error: 'iap:errors.buyProduct', state: PurchaseState.PRODUCT_PURCHASING_FAILED });
    yield call(finishPurchase);
    return;
  }

  // Step 4: validate purchase (save transaction to backend)
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

  yield put(purchaseActions.refresh());
  yield call(finishPurchase);
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
