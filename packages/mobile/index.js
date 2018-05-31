// https://github.com/facebook/react-native/issues/15902#issuecomment-375521246
// symbol polyfills
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

import { AppRegistry } from 'react-native';
import App from './src/App';
// import App from './storybook';

AppRegistry.registerComponent('whitewater', () => App);
