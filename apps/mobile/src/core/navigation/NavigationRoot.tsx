import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
// import { useFlipper } from '@react-navigation/devtools';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import Config from 'react-native-ultimate-config';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import SplashScreen from '~/components/SplashScreen';

import usePersistence from './usePersistence';
import useTracking from './useTracking';

export const NavigationRoot: FC<PropsWithChildren> = ({ children }) => {
  const { state, ready, onStateChange } = usePersistence();
  const navigationRef = useNavigationContainerRef();
  const screenTracker = useTracking(navigationRef, onStateChange);
  // useFlipper(navigationRef);

  useEffectOnce(() => {
    if (Config.E2E_MODE === 'true') {
      SplashScreen.hide();
    }
  });

  if (!ready) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={state}
      onReady={screenTracker.onReady}
      onStateChange={screenTracker.onStateChange}
    >
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </NavigationContainer>
  );
};
