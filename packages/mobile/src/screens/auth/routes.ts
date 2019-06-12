import { NavigationRouteConfigMap } from 'react-navigation';
import theme from '../../theme';
import Screens from '../screen-names';
import { ForgotScreen } from './forgot';
import { AuthMainScreen } from './main';
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
  [Screens.Auth.Main]: {
    screen: AuthMainScreen,
    navigationOptions,
  },
  [Screens.Auth.SignIn]: {
    screen: SignInScreen,
    navigationOptions,
  },
  [Screens.Auth.Register]: {
    screen: RegisterScreen,
    navigationOptions,
  },
  [Screens.Auth.Forgot]: {
    screen: ForgotScreen,
    navigationOptions,
  },
  [Screens.Auth.Reset]: {
    screen: ResetScreen,
    navigationOptions,
  },
  [Screens.Auth.Welcome]: {
    screen: WelcomeScreen,
    navigationOptions: {
      ...navigationOptions,
      headerLeft: null,
    },
  },
};
