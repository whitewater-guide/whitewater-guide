import { Alert } from 'react-native';
import { channel } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { resetNavigationToLogin } from '../actions';
import { confirmLogout, logout } from './actions';

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
    [ confirmButton, cancelButton ],
  );
}

function *watchLogoutConfirmed() {
  yield put(confirmLogout());
  yield put(resetNavigationToLogin());
}
