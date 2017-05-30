import { all, take, put, spawn } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import SplashScreen from 'react-native-splash-screen';
import Crashes from "mobile-center-crashes";
import * as ActionTypes from '../actions/ActionTypes';
import AndroidBackButtonSaga from './AndroidBackButtonSaga';

export default function *appSaga() {
  // Wait till redux-persist rehydrates
  yield take(REHYDRATE);

  yield all([
    spawn(AndroidBackButtonSaga),
  ]);

  yield put({ type: ActionTypes.APP_STARTED });

  // if (!__DEV__) {
  //   yield call(delay, 3000);
  // }

  SplashScreen.hide();
  Crashes.generateTestCrash();
}

