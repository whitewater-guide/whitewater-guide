import { takeEvery } from 'redux-saga/effects';
import { purchaseActions } from './actions';
import { fetchProductInfo, purchaseProduct, refreshPremium } from './sagas';

export function* purchasesSaga() {
  yield takeEvery(purchaseActions.fetch, fetchProductInfo);
  yield takeEvery(purchaseActions.buy, purchaseProduct);
  yield takeEvery(purchaseActions.refresh, refreshPremium);
}
