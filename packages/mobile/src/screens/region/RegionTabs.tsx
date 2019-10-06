import React from 'react';
import { register } from 'react-native-bundle-splitter';
import {
  NavigationRouteConfigMap,
  NavigationRouter,
  NavigationScreenComponent,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import theme from '../../theme';
import Screens from '../screen-names';
import HeaderRight from './HeaderRight';
import { LazyRegionInfoScreen } from './info';
import { LazyRegionMapScreen } from './map';
import RegionTitle from './RegionTitle';
import { LazyRegionSectionsListScreen } from './sections-list';

const routes: NavigationRouteConfigMap = {
  [Screens.Region.Tabs.Map]: {
    screen: LazyRegionMapScreen,
  },
  [Screens.Region.Tabs.SectionsList]: {
    screen: LazyRegionSectionsListScreen,
  },
  [Screens.Region.Tabs.Info]: {
    screen: LazyRegionInfoScreen,
  },
};

const config = {
  initialRouteName: Screens.Region.Tabs.Map,
  backBehavior: 'none',
  swipeEnabled: false,
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: theme.colors.textLight,
    allowFontScaling: true,
  },
  barStyle: {
    backgroundColor: theme.colors.primary,
  },
  shifting: true,
};

const LazyRegionTabs = register({
  require: () => require('./LazyRegionTabs'),
});

const Navigator = createMaterialBottomTabNavigator(routes, config);

type NavComponent = NavigationScreenComponent & {
  router?: NavigationRouter;
};

const RegionTabs: NavComponent = React.memo((props) => {
  const { navigation } = props;
  return (
    <LazyRegionTabs>
      <Navigator navigation={navigation} />
    </LazyRegionTabs>
  );
});

RegionTabs.displayName = 'RegionTabs';
RegionTabs.router = Navigator.router;
RegionTabs.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});

export default RegionTabs;
