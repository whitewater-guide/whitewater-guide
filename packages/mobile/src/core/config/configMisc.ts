import Mapbox from '@react-native-mapbox-gl/maps';
import { Platform, UIManager, YellowBox } from 'react-native';
import Config from 'react-native-config';
import { useScreens } from 'react-native-screens';

const configMisc = () => {
  console.disableYellowBox = true;

  // TODO: possible react-native-screens and react-native-splash-screen conflict causing crashes
  // https://github.com/kmagiera/react-native-screens/issues/54
  if (Platform.OS === 'ios') {
    useScreens();
  }

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
  Mapbox.setTelemetryEnabled(false);

  // https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md#how-it-works
  // uncomment for network inspection

  // global.XMLHttpRequest = global.originalXMLHttpRequest
  //   ? global.originalXMLHttpRequest
  //   : global.XMLHttpRequest;
  // global.FormData = global.originalFormData
  //   ? global.originalFormData
  //   : global.FormData;
  //
  // // tslint:disable-next-line:no-unused-expression
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
};

export default configMisc;
