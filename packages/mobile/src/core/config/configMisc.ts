import { YellowBox } from 'react-native';

const configMisc = () => {
  YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader requires',
  ]);
};

export default configMisc;
