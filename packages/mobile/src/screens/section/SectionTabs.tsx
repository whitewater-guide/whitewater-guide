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
import { LazySectionChartScreen } from './chart';
import { LazySectionGuideScreen } from './guide';
import HeaderRight from './HeaderRight';
import { LazySectionInfoScreen } from './info';
import { LazySectionMapScreen } from './map';
import { LazySectionMediaScreen } from './media';
import SectionTitle from './SectionTitle';
import { NavParams } from './types';

const routes: NavigationRouteConfigMap = {
  [Screens.Section.Map]: {
    screen: LazySectionMapScreen,
  },
  [Screens.Section.Chart]: {
    screen: LazySectionChartScreen,
  },
  [Screens.Section.Info]: {
    screen: LazySectionInfoScreen,
  },
  [Screens.Section.Guide]: {
    screen: LazySectionGuideScreen,
  },
  [Screens.Section.Media]: {
    screen: LazySectionMediaScreen,
  },
};

const config = {
  initialRouteName: Screens.Section.Info,
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

const Navigator = createMaterialBottomTabNavigator(routes, config);

const LazySectionTabs = register({
  require: () => require('./LazySectionTabs'),
});

export const SectionTabs: NavigationScreenComponent<NavParams> & {
  router: NavigationRouter;
} = ({ navigation }) => {
  const regionId = navigation.getParam('regionId');
  const sectionId = navigation.getParam('sectionId');
  return (
    <LazySectionTabs regionId={regionId} sectionId={sectionId}>
      <Navigator navigation={navigation} />
    </LazySectionTabs>
  );
};

SectionTabs.router = Navigator.router;

SectionTabs.navigationOptions = ({ navigation }) => ({
  headerTitle: <SectionTitle sectionId={navigation.getParam('sectionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});
