import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { RegionsListScreen, SecondScreenStack, RegionTabs } from '../screens';

const RegionsStack = StackNavigator(
  {
    RegionsList: {
      screen: RegionsListScreen,
    },
    RegionDetails: {
      screen: RegionTabs,
    },
  },
  {
    initialRouteName: 'RegionsList',
  },
);

const Routes = {
  RegionsRoot: {
    screen: RegionsStack,
  },
  SecondScreen: {
    screen: SecondScreenStack,
  },
};

if (__DEV__) {
  /* eslint global-require: 0 */
  const StorybookUI = require('../../storybook').default;
  Routes.Storybook = {
    screen: StorybookUI,
  };
}

const Config = {
  initialRouteName: 'RegionsRoot',
};

export const RootNavigator = DrawerNavigator(Routes, Config);
export const RootRouter = RootNavigator.router;
