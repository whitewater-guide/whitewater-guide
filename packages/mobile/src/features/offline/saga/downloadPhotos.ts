import FastImage from 'react-native-fast-image';
import { Channel, END, EventChannel, eventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { offlineContentActions } from '../actions';

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
  const chan: EventChannel<number> = eventChannel((emitter) => {
    FastImage.preload(
      photos.map((uri) => ({ uri })),
      // Total is not from current batch, but comes as arg
      (loaded: number) => emitter(loaded),
      () => emitter(END),
    );
    return () => {};
  });
  try {
    while (true) {
      const progress: number = yield take(chan);
      yield put(offlineContentActions.updateProgress({ media: progress + offset }));
    }
  } finally {
    // console.log('Media download complete');
  }
}
