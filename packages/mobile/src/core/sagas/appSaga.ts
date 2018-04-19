import Crashes from 'appcenter-crashes';
import { call, put, spawn, take } from 'redux-saga/effects';
import { appStarted, bootstrapped, resetNavigationToHome } from '../actions';
import { auth, authSaga } from '../auth';
import { navigationChannel } from './navigationChannel';

export function *appSaga() {
  // Wait till redux-persist rehydrates
  yield take(bootstrapped.type);
  // TODO: wait till apollo-cache rehydrates

  // Initial auth actions block app loading
  yield spawn(authSaga);
  yield take(auth.initialized.type);
  // Wait until init is complete
  // const me = yield take(auth.initialized.type);

  const didCrash = yield call([Crashes, 'hasCrashedInLastSession']);
  if (didCrash) {
    // yield put(me ? resetNavigationToHome() : resetNavigationToLogin());
    yield put(navigationChannel, resetNavigationToHome());
  }
  // Show app screens
  yield put(appStarted());
  // yield call(delay, 3000);
}
