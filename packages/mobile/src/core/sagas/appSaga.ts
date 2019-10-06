import { networkSaga } from 'react-native-offline';
import { spawn } from 'redux-saga/effects';
import { offlineContentSaga } from '../../features/offline';

export function* appSaga() {
  yield spawn(networkSaga, {
    withExtraHeadRequest: false,
  });
  yield spawn(offlineContentSaga);
}
