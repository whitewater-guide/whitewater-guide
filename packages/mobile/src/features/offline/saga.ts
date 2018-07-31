import { call, take, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { getApolloClient } from '../../core/apollo';
import { offlineContentActions } from './actions';
import { OfflineCategorySelection } from './types';

export function *offlineContentSaga() {
  while (true) {
    yield call(downloadOfflineContent);
  }
}

export function *downloadOfflineContent() {
  const { payload }: Action<OfflineCategorySelection> = yield take(offlineContentActions.startDownload);
  // get media summary
  const client = yield getApolloClient();
  // dispatch progress
  // batch-download sections, form media list
  // download media and thumbs
  // dispatch download complete
}