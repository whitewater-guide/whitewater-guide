import RNCNetInfoMock from '@react-native-community/netinfo/jest/netinfo-mock';
import fetchMock from 'fetch-mock';
import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = RNCNetInfoMock;

jest.mock('./src/core/errors/tracker');
jest.mock('./src/core/errors/configErrors');
jest.mock('react-native-reanimated', () =>
  // eslint-disable-next-line global-require
  require('react-native-reanimated/mock'),
);
fetchMock.config.overwriteRoutes = false;
global.fetch = fetchMock.sandbox();
