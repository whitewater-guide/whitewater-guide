import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { RegionsListScreen, AllSectionsModalStack, RegionScreen, SectionScreen } from '../../screens';
import { BurgerButton } from '../../components';
import I18n from '../../i18n';

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
      title: I18n.t('regionsList.title'),
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
  const StorybookUI = require('../../../storybook').default;
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
  navigationOptions: {
    header: null,
  },
};

const RootTabs = TabNavigator(Routes, Config);

export default RootTabs;
