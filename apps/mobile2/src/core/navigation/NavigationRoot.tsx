import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import BootSplash from 'react-native-bootsplash';

import { trackScreen } from '../analytics';
import { navigationIntegration } from '../errors/configErrors';
import { ensureNotificationPermission } from '../pushNotifications';
import type { RootDrawerParamsList } from './navigation-params';
import RootDrawer from './RootDrawer';
import useLinking from './useLinking';
import usePersistence from './usePersistence';
import useSignOut from './useSignOut';

function NavigationRoot() {
  const navigationRef = useNavigationContainerRef<RootDrawerParamsList>();
  const routeNameRef = useRef<string | undefined>(undefined);
  const linking = useLinking();
  const {
    ready,
    state,
    onStateChange: onPersistenceStateChange,
  } = usePersistence();

  const reset = useCallback(
    (resetState: any) => {
      navigationRef.current?.reset(resetState);
    },
    [navigationRef],
  );

  useSignOut(reset);

  useEffect(() => {
    if (ready) {
      BootSplash.hide({ fade: true });
      ensureNotificationPermission().catch(() => {});
    }
  }, [ready]);

  const handleTrackingStateChange = useCallback(() => {
    const previous = routeNameRef.current;
    const current = navigationRef.getCurrentRoute()?.name;
    if (current && previous !== current) {
      trackScreen(current);
    }
    routeNameRef.current = current;
  }, [navigationRef]);

  const handleStateChange = useCallback(
    (state: any) => {
      onPersistenceStateChange(state);
      handleTrackingStateChange();
    },
    [onPersistenceStateChange, handleTrackingStateChange],
  );

  if (!ready) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      initialState={state}
      onReady={() => {
        navigationIntegration.registerNavigationContainer(navigationRef);
        handleTrackingStateChange();
      }}
      onStateChange={handleStateChange}
    >
      <BottomSheetModalProvider>
        <RootDrawer />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}

export default NavigationRoot;
