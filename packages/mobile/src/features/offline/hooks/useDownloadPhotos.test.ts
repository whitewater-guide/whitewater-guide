import { act, renderHook } from '@testing-library/react-hooks';
import FastImage from 'react-native-fast-image';

import { mockImagePreload } from '../test-utils';
import { PhotoChannel } from '../utils';
import useDownloadPhotos from './useDownloadPhotos';

(FastImage.preload as jest.Mock).mockImplementation(mockImagePreload);

it('should download photos', async () => {
  const onProgress = jest.fn();
  const { result, waitFor } = renderHook(() => useDownloadPhotos(onProgress));
  const channel = new PhotoChannel(2);
  expect(result.current).toMatchObject({
    error: undefined,
    loading: false,
  });
  act(() => {
    result.current.download(7, channel);
  });
  expect(result.current).toMatchObject({
    error: undefined,
    loading: true,
  });
  act(() => {
    channel.put(['1', '2']);
    channel.put(['3', '4', '5']);
    channel.put(['6', '7']);
    channel.close();
  });
  await waitFor(() => {
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
  expect(result.current).toMatchObject({
    error: undefined,
    loading: false,
  });
});
