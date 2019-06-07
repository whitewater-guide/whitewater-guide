import { NavigationRouteConfigMap } from 'react-navigation';
import theme from '../../theme';
import { ForgotScreen } from './forgot';
import { RegisterScreen } from './register';
import { ResetScreen } from './reset';
import { SignInScreen } from './signin';
import { WelcomeScreen } from './welcome';

const navigationOptions = {
  header: undefined,
  headerStyle: {
    backgroundColor: theme.colors.primaryBackground,
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTintColor: theme.colors.primary,
};

export const AuthRoutes: NavigationRouteConfigMap = {
  AuthSignIn: {
    screen: SignInScreen,
    navigationOptions,
  },
  AuthRegister: {
    screen: RegisterScreen,
    navigationOptions,
  },
  AuthForgot: {
    screen: ForgotScreen,
    navigationOptions,
  },
  AuthReset: {
    screen: ResetScreen,
    navigationOptions,
  },
  AuthWelcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      ...navigationOptions,
      headerLeft: null,
    },
  },
};
