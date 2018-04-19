import React from 'react';
import { createMaterialBottomTabNavigator, NavigationRouteConfigMap, TabNavigatorConfig } from 'react-navigation';
import RegionInfoScreen from './info';
import RegionMapScreen from './map';
import RegionSectionsListScreen from './sections-list';

const routes: NavigationRouteConfigMap = {
  RegionMap: {
    screen: RegionMapScreen,
  },
  RegionSectionsList: {
    screen: RegionSectionsListScreen,
  },
  RegionInfo: {
    screen: RegionInfoScreen,
  },
};

const config: TabNavigatorConfig = {
  initialRouteName: 'RegionInfo',
};

const RegionTabs = createMaterialBottomTabNavigator(routes, config);

export default RegionTabs;
