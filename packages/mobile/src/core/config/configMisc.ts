import Mapbox from '@react-native-mapbox-gl/maps';
import { LogBox, UIManager } from 'react-native';
import Config from 'react-native-ultimate-config';

const configMisc = () => {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
  Mapbox.setTelemetryEnabled(false);

  LogBox.ignoreLogs(['`new NativeEventEmitter()`']);

  // https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md#how-it-works
  // uncomment for network inspection

  // global.XMLHttpRequest = global.originalXMLHttpRequest
  //   ? global.originalXMLHttpRequest
  //   : global.XMLHttpRequest;
  // global.FormData = global.originalFormData
  //   ? global.originalFormData
  //   : global.FormData;
  //
  // fetch; // Ensure to get the lazy property
  //
  // if (window.__FETCH_SUPPORT__) {
  //   // it's RNDebugger only to have
  //   window.__FETCH_SUPPORT__.blob = false;
  // } else {
  //   /*
  //    * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
  //    * If you're using another way you can just use the native Blob and remove the `else` statement
  //    */
  //   global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
  //   global.FileReader = global.originalFileReader
  //     ? global.originalFileReader
  //     : global.FileReader;
  // }

  // Used to track infinite loops
  // (function() {
  //   const oldSetTimeout = global.setTimeout;
  //   global.setTimeout = function(...args) {
  //     const e = new Error('Looking for timers');
  //     console.log('New timeout registered from %s', e.stack);
  //     return oldSetTimeout.apply(this, args);
  //   };
  //   const oldSetInterval = global.setInterval;
  //   global.setInterval = function(...args) {
  //     const e = new Error('Looking for timers');
  //     console.log('New interval registered from %s', e.stack);
  //     return oldSetInterval.apply(this, args);
  //   };
  // })();
};

export default configMisc;
