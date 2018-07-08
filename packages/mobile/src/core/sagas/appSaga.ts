import Config from 'react-native-config';
import { networkEventsListenerSaga } from 'react-native-offline';
import { put, spawn, take } from 'redux-saga/effects';
import { purchasesSaga } from '../../features/purchases';
import { appStarted, bootstrapped } from '../actions';
import { auth, authSaga } from '../auth';
import { messagingSaga } from './messagingSaga';

export function *appSaga() {
  // Wait till redux-persist rehydrates
  yield take(bootstrapped.type);
  // TODO: wait till apollo-cache rehydrates

  // Initial auth actions block app loading
  yield spawn(networkEventsListenerSaga, { pingServerUrl: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}` });
  yield spawn(authSaga);
  yield spawn(messagingSaga);
  yield spawn(purchasesSaga);
  yield take(auth.initialized.type);
  // Wait until init is complete
  // const me = yield take(auth.initialized.type);

  // const didCrash = yield call([Crashes, 'hasCrashedInLastSession']);
  // if (didCrash) {
    // yield put(me ? resetNavigationToHome() : resetNavigationToLogin());
    // yield put(navigationChannel, resetNavigationToHome());
  // }
  // Show app screens
  yield put(appStarted());
  // yield call(delay, 3000);
}
