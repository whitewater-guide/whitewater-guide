import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import Config from 'react-native-ultimate-config';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import SplashScreen from '~/components/SplashScreen';

import usePersistence from './usePersistence';
import useTracking from './useTracking';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const NavigationRoot: React.FC = ({ children }) => {
  const { state, ready, onStateChange } = usePersistence();
  const trackStateChange = useTracking(onStateChange);
  const navigationRef = useNavigationContainerRef();

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
      initialState={state}
      onStateChange={trackStateChange}
      onReady={() => {
        // Register the navigation container with the instrumentation
        routingInstrumentation.registerNavigationContainer(navigationRef);
      }}
    >
      {children}
    </NavigationContainer>
  );
};
