import 'react-native-gesture-handler';
import './src/i18n/polyfill';
import '@whitewater-guide/validation/dist/esm/extensions';

import { AppRegistry } from 'react-native';
import { enableFreeze } from 'react-native-screens';

import App from './src/App';

enableFreeze(true);

AppRegistry.registerComponent('whitewater', () => App);
