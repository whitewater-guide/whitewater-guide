import FastImage from '@whitewater-guide/react-native-fast-image';

import { mockImagePreload } from '../test-utils';
import { PhotoChannel } from '../utils';
import { PhotoDownloader } from './PhotoDownloader';

(FastImage.preload as jest.Mock).mockImplementation(mockImagePreload);

it('should download batch', async () => {
  const onProgress = jest.fn();
  const downloader = new PhotoDownloader(7, onProgress, 1);
  const channel = new PhotoChannel(2);
  const promise = downloader.download(channel);
  channel.put(['1', '2']);
  channel.put(['3', '4', '5']);
  channel.put(['6', '7']);
  channel.close();
  await promise;
  expect(onProgress.mock.calls).toEqual([
    [{ media: [1, 7] }],
    [{ media: [2, 7] }],
    [{ media: [3, 7] }],
    [{ media: [4, 7] }],
    [{ media: [5, 7] }],
    [{ media: [6, 7] }],
    [{ media: [7, 7] }],
  ]);
});
