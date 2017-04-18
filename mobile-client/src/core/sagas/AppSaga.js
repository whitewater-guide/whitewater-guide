import { call, take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { REHYDRATE } from 'redux-persist/constants';
import SplashScreen from 'react-native-splash-screen';
import * as ActionTypes from '../actions/ActionTypes';

export default function *appSaga() {
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

  // if (!__DEV__) {
  //   yield call(delay, 3000);
  // }

  SplashScreen.hide();
}

