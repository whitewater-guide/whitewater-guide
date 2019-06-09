import { UIManager, YellowBox } from 'react-native';

const configMisc = () => {
  YellowBox.ignoreWarnings(['Setting a timer']);

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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
