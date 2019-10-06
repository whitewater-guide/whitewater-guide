import { getHeaderRenderer } from 'components/header';
import { NavigationRouteConfigMap } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import theme from '../../theme';
import { StackNavigatorConfig } from '../../utils/navigation';
import Screens from '../screen-names';
import { LazyForgotScreen } from './forgot';
import { LazyMainScreen } from './main';
import { LazyRegisterScreen } from './register';
import { LazyResetScreen } from './reset';
import { LazySignInScreen } from './signin';
import { LazyWelcomeScreen } from './welcome';

const routes: NavigationRouteConfigMap = {
  [Screens.Auth.Main]: {
    screen: LazyMainScreen,
  },
  [Screens.Auth.SignIn]: {
    screen: LazySignInScreen,
  },
  [Screens.Auth.Register]: {
    screen: LazyRegisterScreen,
  },
  [Screens.Auth.Forgot]: {
    screen: LazyForgotScreen,
  },
  [Screens.Auth.Reset]: {
    screen: LazyResetScreen,
  },
  [Screens.Auth.Welcome]: {
    screen: LazyWelcomeScreen,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.Auth.Main,
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: getHeaderRenderer(false),
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: theme.colors.primaryBackground,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTintColor: theme.colors.primary,
  },
};

export const AuthStack = createStackNavigator(routes, config);
AuthStack.navigationOptions = {
  header: null,
};
