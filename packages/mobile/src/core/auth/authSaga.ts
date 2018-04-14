import { all, spawn } from 'redux-saga/effects';
import fbSaga from './fbSaga';
import logoutSaga from './logout';

export function *authSaga() {
  yield all([
    spawn(fbSaga),
    spawn(logoutSaga),
  ]);
}
