import { UIManager, YellowBox } from 'react-native';

const configMisc = () => {
  YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader requires',
    'RCTBridge required dispatch_sync',
  ]);

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

export default configMisc;
