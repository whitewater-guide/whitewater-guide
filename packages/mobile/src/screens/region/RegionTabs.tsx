import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import { NavigationRouteConfigMap, TabNavigatorConfig } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import theme from '../../theme';
import container from './container';
import RegionInfoScreen from './info';
import RegionMapScreen from './map';
import RegionSectionsListScreen from './sections-list';
import SectionsProgress from './SectionsProgress';
import { InnerProps, OuterProps, ScreenProps } from './types';

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
  initialRouteName: 'RegionMap',
  backBehavior: 'none',
  swipeEnabled: false,
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: theme.colors.textLight,
    allowFontScaling: true,
  },
  // Not yet in typedefs
  barStyle: {
    backgroundColor: theme.colors.primary,
  },
  shifting: true,
} as any;

export const Navigator = createMaterialBottomTabNavigator(routes, config);

class RegionTabsContent extends React.PureComponent<InnerProps & OuterProps> {
  render() {
    const { navigation, region, sections, count, status } = this.props;
    const screenProps: ScreenProps = { region, sections };
    return (
      <React.Fragment>
        <Navigator navigation={navigation} screenProps={screenProps} />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <WhitePortal name="region" />
        </View>
        <SectionsProgress
          status={status}
          loaded={sections.length}
          count={count}
        />
      </React.Fragment>
    );
  }
}

export const RegionTabs = container()(RegionTabsContent);
