import { analytics } from 'react-native-firebase';
import { buffers, Channel, channel } from 'redux-saga';
import { all, call, CallEffect, put, select, take } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { RootState } from '../../../core/reducers';
import { NamedNode } from '../../../ww-commons/core';
import { offlineContentActions } from '../actions';
import { OfflineCategorySelection, OfflineProgressPayload } from '../types';
import downloadRegionData from './calls/downloadRegionData';
import readCachedRegionSummary from './calls/readCachedRegionSummary';
import downloadPhotos from './downloadPhotos';
import downloadSections from './downloadSections';

export function* offlineContentSaga() {
  while (true) {
    yield call(downloadOfflineContent);
  }
}

export function* downloadOfflineContent() {
  const { payload }: Action<OfflineCategorySelection> = yield take(offlineContentActions.startDownload);
  const region: NamedNode = yield select((state: RootState) => state.offlineContent.dialogRegion);
  if (!region) {
    return;
  }
  analytics().logEvent('offline_download_started', { region: region.id });
  // get summary
  const { photosCount, sectionsCount } = yield call(readCachedRegionSummary, region.id);
  // dispatch progress
  const initialProgress: OfflineProgressPayload = {
    regionInProgress: region.id,
    data: [0, sectionsCount],
  };
  if (payload.media) {
    initialProgress.media = [0, photosCount * 2]; // multiply for thumbs
  }
  yield put(offlineContentActions.updateProgress(initialProgress));

  // download region data
  yield call(downloadRegionData, region.id);

  // will also contain maps in future
  const callEffects: CallEffect[] = [];
  // batch-download sections
  let mediaChannel: Channel<string[]> | undefined;
  if (payload.media) { // watch event from sections
    mediaChannel = yield call(channel, buffers.expanding(10));
    callEffects.push(call(downloadPhotos, mediaChannel!));
  }
  callEffects.unshift(call(downloadSections, region.id, mediaChannel));
  yield all(callEffects);

  // dispatch download complete
  yield put(offlineContentActions.finishDownload());
  analytics().logEvent('offline_download_complete', { region: region.id });
}
