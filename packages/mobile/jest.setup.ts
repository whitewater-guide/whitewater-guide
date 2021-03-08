/* eslint-disable @typescript-eslint/ban-ts-comment */
import RNCNetInfoMock from '@react-native-community/netinfo/jest/netinfo-mock';
import fetchMock from 'fetch-mock';
import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = RNCNetInfoMock;

// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./src/test/typedefs');
jest.mock('./src/core/errors/tracker');
jest.mock('./src/core/errors/configErrors');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
fetchMock.config.overwriteRoutes = false;
// @ts-ignore
global.fetch = fetchMock.sandbox();
// global.fetch = fetchMock;
