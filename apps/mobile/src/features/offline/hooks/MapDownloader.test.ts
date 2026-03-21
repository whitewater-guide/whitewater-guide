import Mapbox from '@rnmapbox/maps';
import type { Region } from '@whitewater-guide/schema';

import { mockPack, mockPackSubscribe } from '../test-utils';
import MapDownloader from './MapDownloader';

const TEST_BOUNDS: Region['bounds'] = [
  [1, 1, 0],
  [0, 0, 0],
];
const REGION_ID = '__region_id__';

beforeEach(() => {
  jest.resetAllMocks();
});

it('should download new region and track progress', async () => {
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(null);
  (Mapbox.offlineManager.createPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__region_id__', 0, 3),
  );
  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackSubscribe,
  );
  const onProgress = jest.fn();
  const downloader = new MapDownloader(REGION_ID, TEST_BOUNDS, onProgress);
  await downloader.download();
  expect(onProgress.mock.calls).toEqual([
    [{ maps: [0, 100] }],
    [{ maps: [33, 100] }],
    [{ maps: [67, 100] }],
    [{ maps: [100, 100] }],
  ]);
  expect(Mapbox.offlineManager.unsubscribe).toHaveBeenCalled();
});

it('should resume downloading region', async () => {
  const resume = jest.fn();
  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackSubscribe,
  );
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__region_id__', 1, 3, resume),
  );
  const onProgress = jest.fn();
  const downloader = new MapDownloader(REGION_ID, TEST_BOUNDS, onProgress);
  await downloader.download();
  expect(onProgress.mock.calls).toEqual([
    [{ maps: [0, 100] }],
    [{ maps: [33, 100] }],
    [{ maps: [67, 100] }],
    [{ maps: [100, 100] }],
  ]);
  expect(Mapbox.offlineManager.unsubscribe).toHaveBeenCalled();
  expect(resume).toHaveBeenCalled();
});
