import Firebase from 'react-native-firebase';
import { apply, put, select, spawn, take } from 'redux-saga/effects';
import { settings, splashRemoved } from '../actions';
import { RootState } from '../reducers';
import { MessagingPermission } from '../reducers/settingsReducer';

export function *messagingSaga() {
  yield spawn(watchSplashRemoved);
}

/**
 * If user was never asked for notifications permissions, ask him when splash screen is removed
 * @returns {IterableIterator<any>}
 */
function* watchSplashRemoved() {
  yield take(splashRemoved.type);
  const messagingOld = yield select((state: RootState) => state.settings.messaging);
  if (messagingOld === MessagingPermission.UNKNOWN) {
    let enabled = yield apply(Firebase.messaging(), Firebase.messaging().hasPermission);
    if (!enabled) {
      try {
        yield apply(Firebase.messaging(), Firebase.messaging().requestPermission);
        enabled = true;
      } catch (e) {
        enabled = false;
      }
    }
    yield put(settings.setMessaging(enabled ? MessagingPermission.ENABLED : MessagingPermission.DISABLED));
  }
}
