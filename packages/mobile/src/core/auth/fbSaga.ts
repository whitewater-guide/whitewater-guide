import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { apply, call, put, takeEvery } from 'redux-saga/effects';
import { resetNavigationToHome } from '../actions';
import { getApolloClient } from '../apollo';
import { trackError } from '../errors';
import { navigationChannel } from '../sagas';
import { initialized, loginWithFB, logoutWithFB } from './actions';
import { AuthError } from './types';

export default function* fbSaga() {
  LoginManager.setLoginBehavior(Platform.OS === 'ios' ? 'native' : 'native_with_fallback');
  // On startup: refresh token, attempt to relogin with new token
  try {
    const refreshResult = yield apply(AccessToken, AccessToken.refreshCurrentAccessTokenAsync);
    yield call(authWithFbToken, false);
  } catch (err) {
    /* This will throw error when user open app for the first time, so ignore */
  }
  yield takeEvery(loginWithFB.started.type, watchLoginWithFb);
  yield takeEvery(logoutWithFB.type, watchLogoutWithFb);
  yield put(initialized());
}

function* watchLoginWithFb() {
  const result: LoginResult =
    yield apply(LoginManager, LoginManager.logInWithReadPermissions, [['public_profile', 'email']]);
  yield call(authWithFbToken, true);
}

function* watchLogoutWithFb() {
  yield put(navigationChannel, resetNavigationToHome());
  yield call(resetApolloCache);
  LoginManager.logOut();
}

function* authWithFbToken(reset?: boolean) {
  try {
    const token: AccessToken | null = yield apply(AccessToken, AccessToken.getCurrentAccessToken);
    if (token && token.accessToken) {
      const result = yield call(
        axios.get,
        `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/auth/facebook/token?access_token=${token.accessToken}`,
      );
      if (reset) {
        yield call(resetApolloCache);
      }
    }
    yield put(loginWithFB.done({ params: {}, result: {}}));
  } catch (e) {
    trackError('auth', e);
    const error: AuthError = {
      title: 'i18 title',
      description: '18 description',
      error: e,
    };
    yield put(loginWithFB.failed({ params: {}, error }));
  }
}

export function *resetApolloCache() {
  // Read about apollo-cache-persist login flow
  // cachePersistor.pause();
  // yield apply(cachePersistor, cachePersistor.purge);
  const client = getApolloClient();
  try {
    yield apply(client, client.resetStore);
  } catch (e) {}
  // cachePersistor.resume();
}
