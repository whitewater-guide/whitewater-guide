import FastImage from 'react-native-fast-image';
import { buffers, channel, END } from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';
import { offlineContentActions } from '../actions';
import downloadPhotos from './downloadPhotos';
import { mockImagePreload } from './test-utils';

(FastImage.preload as jest.Mock).mockImplementation(mockImagePreload);

it('should download photos and report progress', () => {
  const mediaChan = channel<string[]>(buffers.expanding(10));
  mediaChan.put(['foo1', 'bar1']);
  mediaChan.put(['foo2', 'bar2']);
  mediaChan.put(END);

  return expectSaga(downloadPhotos, mediaChan)
    .put(offlineContentActions.updateProgress({ media: 1 }))
    .put(offlineContentActions.updateProgress({ media: 2 }))
    .put(offlineContentActions.updateProgress({ media: 3 }))
    .put(offlineContentActions.updateProgress({ media: 4 }))
    .not.put(offlineContentActions.updateProgress({ media: 5 }))
    .returns(4)
    .run(false);
});
