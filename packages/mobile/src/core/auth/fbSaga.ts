import axios from 'axios';
import Config from 'react-native-config';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { apply, call, put, takeEvery } from 'redux-saga/effects';
import { getApolloClient } from '../apollo';
import { trackError } from '../errors';
import { loginWithFB } from './actions';
import { AuthError } from './types';

export default function* fbSaga() {
  // On startup: refresh token, attempt to relogin with new token
  try {
    const refreshResult = yield apply(AccessToken, AccessToken.refreshCurrentAccessTokenAsync);
    yield call(authWithFbToken, false);
  } catch (err) {}
  yield takeEvery(loginWithFB.started.type, watchLoginWithFb);
}

function* watchLoginWithFb() {
  const result: LoginResult =
    yield apply(LoginManager, LoginManager.logInWithReadPermissions, [['public_profile', 'email']]);
  yield call(authWithFbToken, true);
}

function* authWithFbToken(reset?: boolean) {
  try {
    const token: AccessToken | null = yield apply(AccessToken, AccessToken.getCurrentAccessToken);
    if (token && token.accessToken) {
      yield call(
        axios.post,
        `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/auth/fb/token`,
        { token: token.accessToken },
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
  yield apply(client, client.resetStore);
  // cachePersistor.resume();
  return 0; // temporary plug
}
