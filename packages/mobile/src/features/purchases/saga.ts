import { consumeAllItems, endConnection, prepare } from 'react-native-iap';
import { offlineActionTypes } from 'react-native-offline';
import { call, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { trackError } from '../../core/errors';
import { purchaseActions } from './actions';
import { watchBuyProduct, watchFetchProduct, watchRefreshPremium, watchRetryOfflinePurchases } from './sagas';

export function* purchasesSaga() {
  yield takeEvery(purchaseActions.fetch, watchFetchProduct);
  yield takeEvery(purchaseActions.buy, watchBuyProduct);
  yield takeEvery(purchaseActions.refresh, watchRefreshPremium);
  yield takeEvery(purchaseActions.retryOfflinePurchases, watchRetryOfflinePurchases);
  yield takeEvery(
    (action: Action<boolean>) => action.type === offlineActionTypes.CONNECTION_CHANGE && action.payload,
    watchRetryOfflinePurchases,
  );
  // Android: all items are consumables
  try {
    yield call(prepare);
    yield call(consumeAllItems);
    yield call(endConnection);
  } catch (e) {
    trackError('iap', e);
  }
}
