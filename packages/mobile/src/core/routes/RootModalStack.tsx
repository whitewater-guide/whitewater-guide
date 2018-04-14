import { StackNavigator, StackNavigatorConfig } from 'react-navigation';
import { LoginScreenStack, MainTabs, PlainTextScreen } from '../../screens';

const Routes = {
  Login: {
    screen: LoginScreenStack,
    navigationOptions: {
      header: null,
    },
  },
  MainStack: {
    screen: MainTabs,
  },
  Plain: {
    screen: PlainTextScreen,
  },
};

const Config: StackNavigatorConfig = {
  initialRouteName: 'MainStack',
  mode: 'modal',
};

const RootModalStack = StackNavigator(Routes, Config);

export default RootModalStack;
