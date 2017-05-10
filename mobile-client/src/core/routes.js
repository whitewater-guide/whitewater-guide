import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { RegionsListScreen, SectionsListScreen, RegionTabs, SectionTabs } from '../screens';
import { BurgerButton } from '../components';

const RegionsStack = StackNavigator(
  {
    RegionsList: {
      screen: RegionsListScreen,
    },
    RegionDetails: {
      screen: RegionTabs,
    },
    SectionDetails: {
      screen: SectionTabs,
    },
  },
  {
    initialRouteName: 'RegionsList',
    navigationOptions: ({ navigation, navigationOptions }) => ({
      headerRight: <BurgerButton navigation={navigation} />,
      ...navigationOptions,
    }),
  },
);

const AllSectionsStack = StackNavigator(
  {
    AllSections: {
      screen: SectionsListScreen,
    },
    SectionDetails: {
      screen: SectionTabs,
    },
  },
  {
    initialRouteName: 'AllSections',
    navigationOptions: ({ navigation }) => ({
      headerRight: <BurgerButton navigation={navigation} />,
    }),
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
