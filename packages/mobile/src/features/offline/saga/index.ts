import { takeEvery } from 'redux-saga/effects';
import { offlineContentActions } from '../actions';
import watchStartDownload from './watchStartDownload';

export function* offlineContentSaga() {
  yield takeEvery(offlineContentActions.startDownload, watchStartDownload);
}
