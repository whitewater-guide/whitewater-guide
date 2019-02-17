import axios from 'axios';
import { Platform } from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { apply, call, delay, put, retry, takeEvery } from 'redux-saga/effects';
import { BACKEND_URL } from '../../utils/urls';
import { resetNavigationToHome } from '../actions';
import { apolloCachePersistor, getApolloClient } from '../apollo';
import { trackError } from '../errors';
import { navigationChannel } from '../sagas';
import { initialized, loginWithFB, logoutWithFB } from './actions';
import { AuthError } from './types';

export default function* fbSaga() {
  LoginManager.setLoginBehavior(
    Platform.OS === 'ios' ? 'native' : 'native_with_fallback',
  );
  // On startup: refresh token, attempt to relogin with new token
  try {
    const refreshResult = yield apply(
      AccessToken,
      AccessToken.refreshCurrentAccessTokenAsync,
      [],
    );
    yield call(authWithFbToken, false);
  } catch (err) {
    /* This will throw error when user open app for the first time, so ignore */
  }
  yield takeEvery(loginWithFB.started.type, watchLoginWithFb);
  yield takeEvery(logoutWithFB.type, watchLogoutWithFb);
  yield put(initialized());
}

function* watchLoginWithFb() {
  LoginManager.logOut();
  const result: LoginResult = yield apply(
    LoginManager,
    LoginManager.logInWithReadPermissions,
    [['public_profile', 'email']],
  );
  if (!result.isCancelled) {
    yield call(authWithFbToken, true);
  }
}

function* watchLogoutWithFb() {
  yield put(navigationChannel, resetNavigationToHome());
  yield call(resetApolloCache);
  LoginManager.logOut();
}

function* authWithFbToken(reset?: boolean): any {
  try {
    const token: AccessToken | null = yield apply(
      AccessToken,
      AccessToken.getCurrentAccessToken,
      [],
    );
    if (token && token.accessToken) {
      // On real iOS device first backend login will fail
      // Probably because of this bug https://github.com/AFNetworking/AFNetworking/issues/4279
      // The app sends request when before it comes to foreground after fb login screen
      // Both delay and retry can solve this problem alone
      // After delay AppState.currentState is still `background`
      // After 1000ms (one retry) AppState.currentState is `active`
      // However, I don't want to add state listener, because I'm not 100% sure what causes this error
      yield delay(500);
      yield retry(3, 1000, loginToBackend, token.accessToken);
      // const result = yield call(loginToBackend, token.accessToken);
      if (reset) {
        yield call(resetApolloCache);
      }
    }
    yield put(loginWithFB.done({ params: {}, result: {} }));
  } catch (e) {
    trackError('auth', e);
    const error: AuthError = {
      title: 'i18 title',
      description: '18 description',
      error: e,
    };
    yield put(loginWithFB.failed({ params: {}, error }));
    LoginManager.logOut();
  }
}

export function* loginToBackend(accessToken: string) {
  const result = yield call(
    axios.get,
    `${BACKEND_URL}/auth/facebook/token?access_token=${accessToken}`,
  );
  return result;
}

// See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
export function* resetApolloCache() {
  apolloCachePersistor.pause();
  yield apply(apolloCachePersistor, apolloCachePersistor.purge, []);
  const client = yield getApolloClient();
  yield apply(client, client.resetStore, []);
  apolloCachePersistor.resume();
}
