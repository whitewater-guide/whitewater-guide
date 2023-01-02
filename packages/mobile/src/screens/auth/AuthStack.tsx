import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Config from 'react-native-ultimate-config';

import { getHeaderRenderer } from '~/components/header';
import { Screens } from '~/core/navigation';

import theme from '../../theme';
import { LazyForgotScreen } from './forgot';
import { LazyMainScreen } from './main';
import { LazyRegisterScreen } from './register';
import { LazyResetScreen } from './reset';
import { LazySignInScreen } from './signin';
import { LazySocialScreen } from './social';
import { AuthStackNavProps, AuthStackParamsList } from './types';
import { LazyWelcomeScreen } from './welcome';

const Stack = createStackNavigator<AuthStackParamsList>();

const screenOptions: StackNavigationOptions = {
  headerMode: 'screen',
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
  headerStyle: {
    marginTop: Platform.OS === 'android' ? getStatusBarHeight(true) : undefined,
    backgroundColor: theme.colors.primaryBackground,
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTintColor: theme.colors.primary,
};

const AuthStack: React.FC<AuthStackNavProps> = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name={Screens.AUTH_MAIN} component={LazyMainScreen} />
    <Stack.Screen name={Screens.AUTH_SIGN_IN} component={LazySignInScreen} />
    <Stack.Screen name={Screens.AUTH_REGISTER} component={LazyRegisterScreen} />
    <Stack.Screen name={Screens.AUTH_FORGOT} component={LazyForgotScreen} />
    <Stack.Screen name={Screens.AUTH_RESET} component={LazyResetScreen} />
    <Stack.Screen name={Screens.AUTH_SOCIAL} component={LazySocialScreen} />
    <Stack.Screen name={Screens.AUTH_WELCOME} component={LazyWelcomeScreen} />
  </Stack.Navigator>
);

export default AuthStack;
