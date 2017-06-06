import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { RegionsListScreen, AllSectionsModalStack, RegionScreen, SectionScreen } from '../screens';
import { BurgerButton } from '../components';

const RegionsStack = StackNavigator(
  {
    RegionsList: {
      screen: RegionsListScreen,
    },
    RegionDetails: {
      screen: RegionScreen,
    },
    SectionDetails: {
      screen: SectionScreen,
    },
  },
  {
    initialRouteName: 'RegionsList',
  },
);

const AllSectionsStack = StackNavigator(
  {
    AllSections: {
      screen: AllSectionsModalStack,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <BurgerButton navigation={navigation} />,
      }),
    },
    SectionDetails: {
      screen: SectionScreen,
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
      tabBarVisible: false,
    },
  },
  AllSectionsRoot: {
    screen: AllSectionsStack,
    navigationOptions: {
      title: 'All Sections',
      tabBarVisible: false,
    },
  },
};

if (__DEV__) {
  /* eslint global-require: 0 */
  const StorybookUI = require('../../storybook').default;
  Routes.Storybook = {
    screen: StorybookUI,
    navigationOptions: {
      title: 'Storybook',
      tabBarVisible: false,
    },
  };
}

const Config = {
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  backBehavior: 'none',
  initialRouteName: 'RegionsRoot',
};

export const RootNavigator = TabNavigator(Routes, Config);
export const RootRouter = RootNavigator.router;
