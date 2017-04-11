import { call, take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Crashes from 'mobile-center-crashes';
import { REHYDRATE } from 'redux-persist/constants';
import SplashScreen from 'react-native-splash-screen';
import * as ActionTypes from '../actions/ActionTypes';

export default function *appSaga() {
  // send all queued crashes without additional processing
  Crashes.process((report, sendCallback) => {
    sendCallback(true);
  }).catch(() => {});
  Crashes.setEnabled(!__DEV__);
  // Wait till redux-persist rehydrates
  yield take(REHYDRATE);

/*  yield [
    fork(newsSaga),
    fork(citiesSaga),
    fork(olympicsSaga),
    fork(GASaga),
    fork(fcmSaga),
    fork(codePushSaga),
  ];*/

  yield put({ type: ActionTypes.APP_STARTED });

  if (!__DEV__) {
    yield call(delay, 3000);
  }

  SplashScreen.hide();
}

