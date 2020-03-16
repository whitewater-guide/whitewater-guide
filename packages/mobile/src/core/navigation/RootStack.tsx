import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import Config from 'react-native-config';
import { getHeaderRenderer } from '~/components/header';
import { RootStackNavProps, RootStackParamsList } from '~/core/navigation';
import { LazyAuthStack } from '~/screens/auth';
import { LazyMyProfileScreen } from '~/screens/my-profile';
import { LazyPlainScreen } from '~/screens/plain';
import { LazyPurchaseStack } from '~/screens/purchase';
import { LazyRegionScreen } from '~/screens/region';
import { RegionsListScreen } from '~/screens/regions-list';
import { LazySectionScreen } from '~/screens/section';
import { LazySuggestionScreen } from '~/screens/suggestion';
import { LazyWebViewScreen } from '~/screens/webview';
import { Screens } from './screen-names';
import { useLinking } from './useLinking';
import useSignOut from './useSignOut';

const Stack = createStackNavigator<RootStackParamsList>();

const screenOptions: StackNavigationOptions = {
  header: getHeaderRenderer(),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
};

const RootStack: React.FC<RootStackNavProps> = ({ navigation }) => {
  useLinking(navigation);
  useSignOut(navigation);
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen name={Screens.REGIONS_LIST} component={RegionsListScreen} />
      <Stack.Screen
        name={Screens.REGION_STACK}
        component={LazyRegionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.SECTION_SCREEN}
        component={LazySectionScreen}
      />
      <Stack.Screen name={Screens.PLAIN} component={LazyPlainScreen} />
      <Stack.Screen name={Screens.WEB_VIEW} component={LazyWebViewScreen} />
      <Stack.Screen
        name={Screens.SUGGESTION}
        component={LazySuggestionScreen}
      />
      <Stack.Screen
        name={Screens.AUTH_STACK}
        component={LazyAuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.PURCHASE_STACK}
        component={LazyPurchaseStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={Screens.MY_PROFILE} component={LazyMyProfileScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
