import { Channel, EventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { offlineContentActions } from '../actions';
import createPhotoChannel from './createPhotoChannel';

export default function* downloadPhotos(channel: Channel<string[]>) {
  try {
    let offset = 0;
    while (true) {
      const photos: string[] = yield take(channel);
      yield call(downloadPhotosWorker, photos, offset);
      offset += photos.length;
    }
  } finally {
    // console.log('Done loading photos');
  }
}

export function* downloadPhotosWorker(photos: string[], offset: number) {
  if (photos.length === 0) {
    return;
  }
  const chan: EventChannel<number> = createPhotoChannel(photos);
  try {
    while (true) {
      const progress: number = yield take(chan);
      yield put(
        offlineContentActions.updateProgress({ media: progress + offset }),
      );
    }
  } finally {
    // console.log('Media download complete');
  }
}
