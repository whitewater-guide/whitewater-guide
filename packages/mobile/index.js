import 'react-native-gesture-handler';
// This polyfill is required because synapse won't accept urls from react-native version of fetch
import 'react-native-url-polyfill/auto';
import '@whitewater-guide/validation/dist/esm/extensions';

import { AppRegistry } from 'react-native';
import { enableFreeze } from 'react-native-screens';

import App from './src/App';

enableFreeze(true);

AppRegistry.registerComponent('whitewater', () => App);
