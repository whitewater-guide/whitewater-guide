/**
 * @format
 */

import '@whitewater-guide/validation';
import 'react-native-gesture-handler';

import { AppRegistry, LogBox } from 'react-native';

import { name as appName } from './app.json';

let RootComponent;

if (process.env.STORYBOOK_ENABLED === 'true') {
  RootComponent = require('./.rnstorybook').default;
} else {
  RootComponent = require('./src/App').default;
}

if (process.env.E2E_MODE === 'true') {
  LogBox.ignoreAllLogs();
}

AppRegistry.registerComponent(appName, () => RootComponent);
