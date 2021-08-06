import { act, renderHook } from '@testing-library/react-hooks';

import useDownloadMap from './useDownloadMap';

const mockDownload = jest.fn();
jest.mock(
  './MapDownloader',
  () =>
    function () {
      return { download: mockDownload };
    },
);

beforeEach(() => {
  jest.resetAllMocks();
});

it('should handle errors', async () => {
  const onProgress = jest.fn();
  mockDownload.mockRejectedValue(new Error('net error'));
  const { result } = renderHook(() => useDownloadMap(onProgress));
  let returned;
  await act(async () => {
    returned = await result.current.download('r', [
      [0, 0, 0],
      [1, 1, 0],
    ]);
  });
  expect(returned).toEqual(new Error('net error'));
  expect(result.current).toMatchObject({
    loading: false,
    error: new Error('net error'),
  });
});
