import React, { useEffect } from 'react';
import NativeSplashScreen from 'react-native-bootsplash';
import { enablePushNotifications } from '../core/pushNotifications';

const SplashScreen: React.FC = () => {
  useEffect(() => {
    return () => {
      NativeSplashScreen.hide();
      enablePushNotifications().catch(() => {});
    };
  }, []);
  return null;
};

export default SplashScreen;
