import { all, spawn, takeEvery } from 'redux-saga/effects';
import { loginViaVK } from './actions';
import logoutSaga from './logout';
import vkSaga from './vk';

export function *authSaga() {
  yield all([
    takeEvery(loginViaVK, vkSaga),
    spawn(logoutSaga),
  ]);
}
