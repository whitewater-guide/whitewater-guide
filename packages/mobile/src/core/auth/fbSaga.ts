import axios from 'axios';
import { Platform } from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { apply, call, put, takeEvery } from 'redux-saga/effects';
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
      const result = yield call(
        axios.get,
        `${BACKEND_URL}/auth/facebook/token?access_token=${token.accessToken}`,
      );
      if (reset) {
        yield call(resetApolloCache);
      }
    }
    yield put(loginWithFB.done({ params: {}, result: {} }));
  } catch (e) {
    // For some reason sometimes this request fails without reaching backend
    if (
      !e.response &&
      e.request._response === 'The network connection was lost.'
    ) {
      yield call(authWithFbToken, reset);
      return;
    }

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

// See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
export function* resetApolloCache() {
  apolloCachePersistor.pause();
  yield apply(apolloCachePersistor, apolloCachePersistor.purge, []);
  const client = yield getApolloClient();
  yield apply(client, client.resetStore, []);
  apolloCachePersistor.resume();
}
