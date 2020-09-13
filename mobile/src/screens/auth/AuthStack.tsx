import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import Config from 'react-native-ultimate-config';

import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';

import theme from '../../theme';
import { LazyForgotScreen } from './forgot';
import { LazyMainScreen } from './main';
import { LazyRegisterScreen } from './register';
import { LazyResetScreen } from './reset';
import { LazySignInScreen } from './signin';
import { AuthStackNavProps, AuthStackParamsList } from './types';
import { LazyWelcomeScreen } from './welcome';

const Stack = createStackNavigator<AuthStackParamsList>();

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
};

const AuthStack: React.FC<AuthStackNavProps> = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen name={Screens.AUTH_MAIN} component={LazyMainScreen} />
      <Stack.Screen name={Screens.AUTH_SIGN_IN} component={LazySignInScreen} />
      <Stack.Screen
        name={Screens.AUTH_REGISTER}
        component={LazyRegisterScreen}
      />
      <Stack.Screen name={Screens.AUTH_FORGOT} component={LazyForgotScreen} />
      <Stack.Screen name={Screens.AUTH_RESET} component={LazyResetScreen} />
      <Stack.Screen name={Screens.AUTH_WELCOME} component={LazyWelcomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
