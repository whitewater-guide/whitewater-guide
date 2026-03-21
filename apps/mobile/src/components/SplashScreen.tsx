import { useEffect } from 'react';
import NativeSplashScreen from 'react-native-bootsplash';

import { enablePushNotifications } from '../core/pushNotifications';

const SplashScreen = () => {
  useEffect(
    () => () => {
      NativeSplashScreen.hide();
      enablePushNotifications().catch(() => {
        // Do not care if we fail to enable push notifications
      });
    },
    [],
  );
  return null;
};

SplashScreen.hide = () => NativeSplashScreen.hide();

export default SplashScreen;
