import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

import type { RootDrawerParamsList } from './navigation-params';
import RootDrawer from './RootDrawer';
import useLinking from './useLinking';
import usePersistence from './usePersistence';

function NavigationRoot() {
  const navigationRef = useNavigationContainerRef<RootDrawerParamsList>();
  const linking = useLinking();
  const { ready, state, onStateChange } = usePersistence();

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
      <RootDrawer />
    </NavigationContainer>
  );
}

export default NavigationRoot;
