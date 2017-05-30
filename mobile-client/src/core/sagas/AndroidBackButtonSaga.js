import { buffers, eventChannel } from 'redux-saga';
import { put, select, takeEvery } from 'redux-saga/effects';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { currentScreenSelector } from '../../utils';

const backButtonChannel = eventChannel(
  (emitter) => {
    const handler = () => {
      emitter(true);
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  },
  buffers.none(),
);

function *watchBackButton() {
  const { routeName } = yield select(currentScreenSelector);
  if (routeName === 'AllSections' || routeName === 'RegionsList') {
    BackHandler.exitApp();
  } else {
    yield put(NavigationActions.back());
  }
}

export default function *androidBackButtonSaga() {
  yield takeEvery(backButtonChannel, watchBackButton);
}
