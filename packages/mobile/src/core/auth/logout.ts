import axios from 'axios';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { channel } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { logout, logoutWithFB } from './actions';

const confirmChannel = channel();
const confirmButton = { text: 'Да', onPress: () => confirmChannel.put('CONFIRM') };
const cancelButton = { text: 'Нет' };

export default function *logoutSaga() {
  yield all([
    takeEvery(logout.toString(), watchLogout),
    takeEvery(confirmChannel, watchLogoutConfirmed),
  ]);
}

function *watchLogout() {
  yield call(
    [Alert, Alert.alert],
    'Выход',
    'Вы действительно хотите выйти из приложения?',
    [ cancelButton, confirmButton ],
  );
}

function *watchLogoutConfirmed() {
  yield call(
    axios.get,
    `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/auth/logout`,
  );
  // Until we don't have any other auth methods, delegate everything to fb saga
  yield put(logoutWithFB());
}
