import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

import Config from 'react-native-ultimate-config';
import { LazyAlreadyHaveScreen } from './already-have';
import { LazyBuyScreen } from './buy';
import { LazySuccessScreen } from './success';
import { LazyVerifyScreen } from './verify';
import { PurchaseStackNavProps } from './types';
import { PurchaseStackParamsList } from '~/screens/purchase/types';
import React from 'react';
import { Screens } from '~/core/navigation';
import { getHeaderRenderer } from '~/components/header';
import theme from '../../theme';

const Stack = createStackNavigator<PurchaseStackParamsList>();

const screenOptions: StackNavigationOptions = {
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
  },
};

const PurchaseStack: React.FC<PurchaseStackNavProps> = ({ route }) => {
  const params = route.params;
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
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
