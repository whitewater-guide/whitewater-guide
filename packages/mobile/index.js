import 'react-native-gesture-handler';
import './src/i18n/polyfill';
import '@whitewater-guide/validation/dist/esm/extensions';

import { AppRegistry } from 'react-native';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import App from './src/App';

// This is required due to use_frameworks! in Podfile
MDCommunity.loadFont();
MaterialIcons.loadFont();

AppRegistry.registerComponent('whitewater', () => App);
