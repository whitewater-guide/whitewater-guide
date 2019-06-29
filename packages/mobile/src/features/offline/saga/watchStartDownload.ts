import { analytics } from 'react-native-firebase';
import { buffers, Channel, channel } from 'redux-saga';
import { all, call, CallEffect, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { trackError } from '../../../core/errors';
import { offlineContentActions } from '../actions';
import { OfflineProgressPayload, StartDownloadPayload } from '../types';
import downloadRegionData from './calls/downloadRegionData';
import readCachedRegionSummary from './calls/readCachedRegionSummary';
import downloadMap from './downloadMap';
import downloadPhotos from './downloadPhotos';
import downloadSections from './downloadSections';

export default function* watchStartDownload({
  payload: { regionId, selection },
}: Action<StartDownloadPayload>) {
  analytics().logEvent('offline_download_started', { region: regionId });
  // get summary
  const { photosCount, sectionsCount } = yield call(
    readCachedRegionSummary,
    regionId,
  );
  // dispatch progress
  const initialProgress: OfflineProgressPayload = {
    data: [0, sectionsCount],
  };
  if (selection.media) {
    initialProgress.media = [0, photosCount * 2]; // multiply for thumbs
  }
  if (selection.maps) {
    initialProgress.maps = [0, 100];
  }
  yield put(offlineContentActions.updateProgress(initialProgress));

  try {
    // download region data
    const regionData = yield call(downloadRegionData, regionId);

    // will also contain maps in future
    const callEffects: CallEffect[] = [];
    // batch-download sections
    let mediaChannel: Channel<string[]> | undefined;
    if (selection.media) {
      // watch event from sections
      mediaChannel = yield call(channel, buffers.expanding(10));
      callEffects.push(call(downloadPhotos, mediaChannel!));
    }
    if (selection.maps) {
      callEffects.push(call(downloadMap, regionData.data.region));
    }
    callEffects.unshift(call(downloadSections, regionId, mediaChannel));
    yield all(callEffects);

    // dispatch download complete
    yield put(offlineContentActions.finishDownload());
    analytics().logEvent('offline_download_complete', { region: regionId });
    return true;
  } catch (e) {
    trackError('watchStartDownload', e);
    yield put(
      offlineContentActions.failDownload({
        message: 'offline:dialog.fatalError',
        fatal: true,
      }),
    );
    return false;
  }
}
