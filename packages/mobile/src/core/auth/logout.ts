import axios from 'axios';
import i18next from 'i18next';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { channel } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { logout, logoutWithFB } from './actions';

const confirmChannel = channel();
const confirmButton = { onPress: () => confirmChannel.put('CONFIRM') };

export default function *logoutSaga() {
  yield all([
    takeEvery(logout.toString(), watchLogout),
    takeEvery(confirmChannel, watchLogoutConfirmed),
  ]);
}

function *watchLogout() {
  yield call(
    [Alert, Alert.alert],
    i18next.t('auth:logoutDialogTitle'),
    i18next.t('auth:logoutDialogMessage'),
    [
      { text: i18next.t('commons:no')},
      { text: i18next.t('commons:yes'), ...confirmButton },
    ],
  );
}

function *watchLogoutConfirmed() {
  try {
    yield call(
      axios.get,
      `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/auth/logout`,
    );
    // Until we don't have any other auth methods, delegate everything to fb saga
    yield put(logoutWithFB());
  } catch (e) {
    yield call(
      [Alert, Alert.alert],
      i18next.t('auth:logoutErrorTitle'),
      i18next.t('auth:logoutErrorMessage'),
      [
        { text: i18next.t('commons:ok') },
      ],
    );
  }
}
