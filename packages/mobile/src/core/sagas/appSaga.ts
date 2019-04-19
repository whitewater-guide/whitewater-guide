import { networkSaga } from 'react-native-offline';
import { put, spawn, take } from 'redux-saga/effects';
import { offlineContentSaga } from '../../features/offline';
import { purchasesSaga } from '../../features/purchases';
import { appStarted, bootstrapped } from '../actions';

export function* appSaga() {
  // Wait till redux-persist rehydrates
  yield take(bootstrapped.type);

  yield spawn(networkSaga, {
    withExtraHeadRequest: false,
  });
  yield spawn(purchasesSaga);
  yield spawn(offlineContentSaga);

  // Show app screens
  yield put(appStarted());
  // yield call(delay, 3000);
}
