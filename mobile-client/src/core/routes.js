import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { RegionsListScreen, SectionsListScreen, RegionTabs } from '../screens';

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

const AllSectionsStack = StackNavigator(
  {
    AllSections: {
      screen: SectionsListScreen,
    },
  },
  {
    initialRouteName: 'AllSections',
  },
);

const Routes = {
  RegionsRoot: {
    screen: RegionsStack,
    navigationOptions: {
      title: 'Regions',
    },
  },
  AllSectionsRoot: {
    screen: AllSectionsStack,
    navigationOptions: {
      title: 'All Sections',
    },
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
