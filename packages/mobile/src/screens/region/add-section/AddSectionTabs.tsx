import React from 'react';
import {
  createMaterialTopTabNavigator,
  NavigationRouteConfigMap,
  TabNavigatorConfig,
} from 'react-navigation';
import theme from '../../../theme';
import Screens from '../../screen-names';
import { AttributesScreen } from './attributes';
import { DescriptionScreen } from './description';
import { FlowsScreen } from './flows';
import { MainScreen } from './main';
import SubmitButton from './SubmitButton';

const routes: NavigationRouteConfigMap = {
  [Screens.Region.AddSection.Tabs.Main]: {
    screen: MainScreen,
  },
  [Screens.Region.AddSection.Tabs.Attributes]: {
    screen: AttributesScreen,
  },
  [Screens.Region.AddSection.Tabs.Description]: {
    screen: DescriptionScreen,
  },
  [Screens.Region.AddSection.Tabs.Flows]: {
    screen: FlowsScreen,
  },
};

const config: TabNavigatorConfig = {
  initialRouteName: Screens.Region.AddSection.Tabs.Main,
  backBehavior: 'none',
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: false,
    scrollEnabled: true,
    indicatorStyle: {
      bottom: undefined,
      top: 0,
      backgroundColor: theme.colors.accent,
    },
    style: {
      backgroundColor: theme.colors.primary,
    },
  },
};

const AddSectionTabs = createMaterialTopTabNavigator(routes, config);
AddSectionTabs.navigationOptions = {
  headerTitle: 'screens:addSection.headerTitle',
  headerRight: <SubmitButton />,
};

export default AddSectionTabs;
