// tslint:disable-next-line
import 'core-js/es6/symbol';
import { UIManager, YellowBox } from 'react-native';

const configMisc = () => {
  YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader requires',
    'RCTBridge required dispatch_sync',
    'Required dispatch_sync to load',
  ]);

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

export default configMisc;
