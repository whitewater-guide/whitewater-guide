import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import Config from 'react-native-ultimate-config';

import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';
import {
  PurchaseStackNavProps,
  PurchaseStackParamsList,
} from '~/screens/purchase/types';
import theme from '~/theme';

import { LazyAlreadyHaveScreen } from './already-have';
import { LazyBuyScreen } from './buy';
import { LazySuccessScreen } from './success';
import { LazyVerifyScreen } from './verify';

const Stack = createStackNavigator<PurchaseStackParamsList>();

const screenOptions: StackNavigationOptions = {
  headerMode: 'screen',
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
  headerStyle: {
    backgroundColor: theme.colors.primaryBackground,
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: {
    backgroundColor: theme.colors.primaryBackground,
    marginTop: initialWindowMetrics?.insets.top,
  },
};

const PurchaseStack: React.FC<PurchaseStackNavProps> = ({ route }) => {
  const { params } = route;
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.PURCHASE_BUY}
        component={LazyBuyScreen}
        initialParams={params}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Screens.PURCHASE_ALREADY_HAVE}
        component={LazyAlreadyHaveScreen}
        initialParams={params}
      />
      <Stack.Screen
        name={Screens.PURCHASE_SUCCESS}
        component={LazySuccessScreen}
        initialParams={params}
      />
      <Stack.Screen
        name={Screens.PURCHASE_VERIFY}
        component={LazyVerifyScreen}
        initialParams={params}
      />
    </Stack.Navigator>
  );
};

export default PurchaseStack;
