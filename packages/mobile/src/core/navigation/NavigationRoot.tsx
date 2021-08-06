import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Config from 'react-native-ultimate-config';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import SplashScreen from '~/components/SplashScreen';

import usePersistence from './usePersistence';
import useTracking from './useTracking';

export const NavigationRoot: React.FC = ({ children }) => {
  const { state, ready, onStateChange } = usePersistence();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const trackStateChange = useTracking(onStateChange);
  useEffectOnce(() => {
    if (Config.E2E_MODE === 'true') {
      SplashScreen.hide();
    }
  });
  if (!ready) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer initialState={state} onStateChange={trackStateChange}>
      {children}
    </NavigationContainer>
  );
};
