import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

import type { RootDrawerParamsList } from './navigation-params';
import RootDrawer from './RootDrawer';
import useLinking from './useLinking';
import usePersistence from './usePersistence';
import useSignOut from './useSignOut';

function NavigationRoot() {
  const navigationRef = useNavigationContainerRef<RootDrawerParamsList>();
  const linking = useLinking();
  const { ready, state, onStateChange } = usePersistence();

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
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      initialState={state}
      onStateChange={onStateChange}
    >
      <BottomSheetModalProvider>
        <RootDrawer />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}

export default NavigationRoot;
