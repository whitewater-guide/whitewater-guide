// tslint:disable:no-var-requires
// tslint:disable-next-line:no-submodule-imports
import RNCNetInfoMock from '@react-native-community/netinfo/jest/netinfo-mock';
import fetchMock from 'fetch-mock';
import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = RNCNetInfoMock;

// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./src/test/typedefs');
jest.mock('./src/core/errors/tracker');
jest.mock('./src/core/errors/configErrors');
jest.mock('react-native-reanimated', () =>
  // tslint:disable-next-line:no-submodule-imports
  require('react-native-reanimated/mock'),
);
fetchMock.config.overwriteRoutes = false;
// @ts-ignore
global.fetch = fetchMock.sandbox();
// global.fetch = fetchMock;
// @ts-ignore
console.disableYellowBox = true;
