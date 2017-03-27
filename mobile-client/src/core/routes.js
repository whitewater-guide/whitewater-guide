import { DrawerNavigator } from 'react-navigation';
import { FirstScreenStack, SecondScreenStack, ThirdScreenTabs } from '../screens';

const Routes = {
  FirstScreen: {
    screen: FirstScreenStack,
    navigationOptions: { title: 'Screen 1' },
  },
  SecondScreen: {
    screen: SecondScreenStack,
    navigationOptions: { title: 'Screen 2' },
  },
  ThirdScreen: {
    screen: ThirdScreenTabs,
    navigationOptions: { title: 'Screen 3' },
  },
};

const Config = {
  initialRouteName: 'FirstScreen',
};

export const RootNavigator = DrawerNavigator(Routes, Config);
export const RootRouter = RootNavigator.router;

