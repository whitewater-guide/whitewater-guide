import Mapbox from '@react-native-mapbox-gl/maps';
import { mockApolloClient } from '@whitewater-guide/clients';
import FastImage from 'react-native-fast-image';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { offlineContentActions } from '../actions';
import { OfflineContentStore } from '../types';
import readCachedRegionSummary from './calls/readCachedRegionSummary';
import { mockImagePreload, mockPack, mockPackSubscribe } from './test-utils';
import watchStartDownload from './watchStartDownload';

jest.mock('react-native-firebase', () => ({
  analytics: () => ({
    logEvent: jest.fn(),
  }),
}));
jest.mock('./constants');
jest.mock('../../../core/apollo/client', () => {
  const { mockApolloData } = require('./test-utils');
  const apolloClient = mockApolloClient(mockApolloData);

  return {
    apolloClient,
  };
});

beforeEach(() => {
  jest.resetAllMocks();

  (Mapbox.offlineManager.subscribe as jest.Mock).mockImplementation(
    mockPackSubscribe,
  );
  (Mapbox.offlineManager.getPack as jest.Mock).mockResolvedValueOnce(null);
  (Mapbox.offlineManager.createPack as jest.Mock).mockResolvedValueOnce(
    mockPack('__test_pack__', 0, 3),
  );
  (FastImage.preload as jest.Mock).mockImplementation(mockImagePreload);
});

it('should download everything', () => {
  const offlineContent: Partial<OfflineContentStore> = {
    dialogRegion: {
      id: '__id__',
      name: '__name__',
    },
  };
  return expectSaga(
    watchStartDownload,
    offlineContentActions.startDownload({
      regionId: '__id__',
      selection: {
        data: true,
        maps: true,
        media: true,
      },
    }),
  )
    .provide([
      [
        matchers.call.fn(readCachedRegionSummary),
        {
          photosCount: 8,
          sectionsCount: 6,
        },
      ],
    ])
    .withState({ offlineContent })
    .put(offlineContentActions.finishDownload())
    .run(false);
});
