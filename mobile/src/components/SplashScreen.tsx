import { useEffect } from 'react';
import NativeSplashScreen from 'react-native-bootsplash';

import { enablePushNotifications } from '../core/pushNotifications';

const SplashScreen = () => {
  useEffect(() => {
    return () => {
      NativeSplashScreen.hide();
      enablePushNotifications().catch(() => {});
    };
  }, []);
  return null;
};

SplashScreen.hide = () => NativeSplashScreen.hide();

export default SplashScreen;
