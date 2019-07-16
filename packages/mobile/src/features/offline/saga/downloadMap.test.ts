import Mapbox from '@react-native-mapbox-gl/maps';
import { expectSaga } from 'redux-saga-test-plan';
import { offlineContentActions } from '../actions';
import downloadMap from './downloadMap';
import { mockPack, mockPackError, mockPackSubscribe } from './test-utils';

beforeEach(() => {
  jest.resetAllMocks();
});

it('should download new region', () => {
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(null);
  (Mapbox.offlineManager.createPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__test_pack__', 0, 3),
  );
  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackSubscribe,
  );

  return expectSaga(downloadMap, {
    id: '__test_pack__',
    bounds: [[1, 1], [0, 0]],
  })
    .put(offlineContentActions.updateProgress({ maps: [33, 100] }))
    .put(offlineContentActions.updateProgress({ maps: [67, 100] }))
    .put(offlineContentActions.updateProgress({ maps: [100, 100] }))
    .run(false);
});

it('should resume downloading region', () => {
  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackSubscribe,
  );
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__test_pack__', 1, 3),
  );

  return expectSaga(downloadMap, {
    id: '__test_pack__',
    bounds: [[1, 1], [0, 0]],
  })
    .put(offlineContentActions.updateProgress({ maps: [67, 100] }))
    .put(offlineContentActions.updateProgress({ maps: [100, 100] }))
    .run(false);
});

it('should terminate and send non-fatal error', () => {
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__test_pack__', 1, 3),
  );
  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackError,
  );

  return expectSaga(downloadMap, {
    id: '__test_pack__',
    bounds: [[1, 1], [0, 0]],
  })
    .put(
      offlineContentActions.failDownload({
        message: 'offline:dialog.mapsError',
      }),
    )
    .run(false);
});
