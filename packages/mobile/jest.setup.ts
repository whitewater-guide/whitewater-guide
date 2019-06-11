// tslint:disable:no-var-requires
import fetchMock from 'fetch-mock';
// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./src/test/typedefs');
jest.mock('./src/core/errors/tracker');
fetchMock.config.overwriteRoutes = false;
// @ts-ignore
// global.fetch = fetchMock.sandbox();
global.fetch = fetchMock;
jest.mock('react-native-sentry');
