import React, { useEffect } from 'react';
import NativeSplashScreen from 'react-native-splash-screen';
import { enablePushNotifications } from '../core/pushNotifications';

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    return () => {
      NativeSplashScreen.hide();
      enablePushNotifications().catch(() => {});
    };
  }, []);
  return null;
};
