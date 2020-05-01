import Config from 'react-native-ultimate-config';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SplashScreen from '~/components/SplashScreen';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import usePersistence from './usePersistence';
import useTracking from './useTracking';

export const NavigationRoot: React.FC = ({ children }) => {
  const { state, ready, onStateChange } = usePersistence();
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
