/**
 * @format
 */

import '@whitewater-guide/validation';
import 'react-native-gesture-handler';

import Mapbox from '@rnmapbox/maps';
import { AppRegistry, LogBox } from 'react-native';
import Config from 'react-native-config';

import { name as appName } from './app.json';

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN ?? '');
Mapbox.setTelemetryEnabled(false);

let RootComponent;

if (process.env.STORYBOOK_ENABLED === 'true') {
  RootComponent = require('./.rnstorybook').default;
} else {
  RootComponent = require('./src/App').default;
}

if (
  process.env.E2E_MODE === 'true' ||
  process.env.STORYBOOK_ENABLED === 'true'
) {
  LogBox.ignoreAllLogs();
}

AppRegistry.registerComponent(appName, () => RootComponent);
