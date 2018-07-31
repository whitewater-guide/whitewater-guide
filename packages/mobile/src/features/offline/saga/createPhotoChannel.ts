import FastImage from 'react-native-fast-image';
import { END, EventChannel, eventChannel } from 'redux-saga';

const createPhotoChannel = (photos: string[]): EventChannel<number> => eventChannel((emitter) => {
  FastImage.preload(
    photos.map((uri) => ({ uri })),
    // Total is not from current batch, but comes as arg
    (loaded: number) => emitter(loaded),
    () => emitter(END),
  );
  return () => {};
});

export default createPhotoChannel;
