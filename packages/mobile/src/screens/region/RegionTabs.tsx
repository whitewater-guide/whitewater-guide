import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import { NavigationRouteConfigMap, TabNavigatorConfig } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import theme from '../../theme';
import container from './container';
import { RegionInfoScreen } from './info';
import RegionMapScreen from './map';
import RegionSectionsListScreen from './sections-list';
import { SectionsListLoader } from './SectionsListLoader';
import SectionsProgress from './SectionsProgress';
import { InnerProps, RenderProps, ScreenProps } from './types';

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
  // @ts-ignore
  barStyle: {
    backgroundColor: theme.colors.primary,
  },
  shifting: true,
};

export const Navigator = createMaterialBottomTabNavigator(routes, config);

class RegionTabsContent extends React.PureComponent<InnerProps> {
  render() {
    const { navigation, region, isConnected, searchTerms, client } = this.props;
    return (
      <SectionsListLoader
        searchTerms={searchTerms}
        region={region}
        isConnected={isConnected}
        client={client}
      >
        {({ sections, count, status, refresh }: RenderProps) => {
          const screenProps: ScreenProps = {
            region,
            sections,
            updateSections: refresh,
            sectionsStatus: status,
          };
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
        }}
      </SectionsListLoader>
    );
  }
}

export const RegionTabs = container(RegionTabsContent);
