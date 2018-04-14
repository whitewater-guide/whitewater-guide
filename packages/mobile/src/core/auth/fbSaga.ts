import Config from 'react-native-config';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import { apply, call, put, takeEvery } from 'redux-saga/effects';
import { loginWithFB } from './actions';
import axios from 'axios';
import { AuthError } from './types';
// import { cachePersistor, client } from '../../apollo';

export default function* fbSaga() {
  // On startup: refresh token, attempt to relogin with new token
  const refreshResult = yield apply(AccessToken, AccessToken.refreshCurrentAccessTokenAsync);
  console.log(refreshResult);
  const token: AccessToken | null = yield apply(AccessToken, AccessToken.getCurrentAccessToken);
  if (token && token.accessToken) {
    yield call(authWithFbToken, token.accessToken);
  }
  yield takeEvery(loginWithFB.started.type, watchLoginWithFb);
}

function* watchLoginWithFb() {
  const result: LoginResult =
    yield apply(LoginManager, LoginManager.logInWithReadPermissions, [['public_profile, email']]);
  // Assumption: LoginScreen is on top of the stack
  if (vkResponse.access_token) {
    yield put(NavigationActions.back());
  }
}

function* authWithFbToken(token: string) {
  try {
    yield call(
      axios.post,
      `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/auth/fb/token`,
      { token },
    );
    yield call(postLoginCommonSaga);
    yield put(loginWithFB.done({ params: {}, result: {}}));
  } catch (e) {
    const error: AuthError = {
      title: 'i18 title',
      description: '18 description',
      error: e,
    };
    yield put(loginWithFB.failed({ params: {}, error }));
  }
}


export function *postLoginCommonSaga() {
  // Read about apollo-cache-persist login flow
  // cachePersistor.pause();
  // yield apply(cachePersistor, cachePersistor.purge);
  // yield apply(client, client.resetStore);
  // cachePersistor.resume();
}
