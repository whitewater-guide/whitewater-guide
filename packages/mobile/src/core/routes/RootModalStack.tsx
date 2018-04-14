import { StackNavigator, StackNavigatorConfig } from 'react-navigation';
import { PlainTextScreen } from '../../screens';
import MainTabs from './MainTabs';

const Routes = {
  Main: {
    screen: MainTabs,
  },
  Plain: {
    screen: PlainTextScreen,
  },
  // MyProfile: {
  //   screen: MyProfileScreen,
  // },
  // Login: {
  //   screen: LoginScreen,
  // },
};

const Config: StackNavigatorConfig = {
  initialRouteName: 'Main',
  mode: 'modal',
};

const RootModalStack = StackNavigator(Routes, Config);

export default RootModalStack;
