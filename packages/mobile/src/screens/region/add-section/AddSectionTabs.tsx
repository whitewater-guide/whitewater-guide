import React from 'react';
import { NavigationRouteConfigMap } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import theme from '../../../theme';
import { TabNavigatorConfig } from '../../../utils/navigation';
import Screens from '../../screen-names';
import { LazyAttributesScreen } from './attributes';
import { LazyDescriptionScreen } from './description';
import { LazyFlowsScreen } from './flows';
import { LazyMainScreen } from './main';
import SubmitButton from './SubmitButton';

const routes: NavigationRouteConfigMap = {
  [Screens.Region.AddSection.Tabs.Main]: {
    screen: LazyMainScreen,
  },
  [Screens.Region.AddSection.Tabs.Attributes]: {
    screen: LazyAttributesScreen,
  },
  [Screens.Region.AddSection.Tabs.Description]: {
    screen: LazyDescriptionScreen,
  },
  [Screens.Region.AddSection.Tabs.Flows]: {
    screen: LazyFlowsScreen,
  },
};

const config: TabNavigatorConfig = {
  // TODO: https://github.com/react-navigation/tabs/issues/162
  // @ts-ignore
  initialRouteName: Screens.Region.AddSection.Tabs.Main,
  backBehavior: 'none',
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  tabBarPosition: 'bottom',
  initialLayout: {
    height: theme.stackScreenHeight,
    width: theme.screenWidth,
  },
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

// TODO: wait till typedefs are fixed
const AddSectionTabs: any = createMaterialTopTabNavigator(routes, config);
AddSectionTabs.navigationOptions = {
  headerTitle: 'screens:addSection.headerTitle',
  headerRight: <SubmitButton />,
};

export default AddSectionTabs;
