import { DrawerNavigator } from 'react-navigation';
import { ListRegionsStack, SecondScreenStack, RegionTabs } from '../screens';

const Routes = {
  ListRegions: {
    screen: ListRegionsStack,
    navigationOptions: { title: 'Regions' },
  },
  Region: {
    screen: RegionTabs,
    navigationOptions: { title: 'Region' },
  },
  SecondScreen: {
    screen: SecondScreenStack,
    navigationOptions: { title: 'Screen 3' },
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
  initialRouteName: 'ListRegions',
};

export const RootNavigator = DrawerNavigator(Routes, Config);
export const RootRouter = RootNavigator.router;
