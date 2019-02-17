import axios from 'axios';
import i18next from 'i18next';
import { Alert } from 'react-native';
import { channel } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { BACKEND_URL } from '../../utils/urls';
import { logout, logoutWithFB } from './actions';

const confirmChannel = channel();
const confirmButton = { onPress: () => confirmChannel.put('CONFIRM') };

export default function* logoutSaga() {
  yield all([
    takeEvery(logout.toString(), watchLogout),
    takeEvery(confirmChannel, watchLogoutConfirmed),
  ]);
}

function* watchLogout() {
  yield call(
    [Alert, Alert.alert],
    i18next.t('auth:logoutDialogTitle'),
    i18next.t('auth:logoutDialogMessage'),
    [
      { text: i18next.t('commons:no') as string },
      { text: i18next.t('commons:yes') as string, ...confirmButton },
    ],
  );
}

function* watchLogoutConfirmed() {
  try {
    yield call(axios.get, `${BACKEND_URL}/auth/logout`);
    // Until we don't have any other auth methods, delegate everything to fb saga
    yield put(logoutWithFB());
  } catch (e) {
    yield call(
      [Alert, Alert.alert],
      i18next.t('auth:logoutErrorTitle'),
      i18next.t('auth:logoutErrorMessage'),
      [{ text: i18next.t('commons:ok') as string }],
    );
  }
}
