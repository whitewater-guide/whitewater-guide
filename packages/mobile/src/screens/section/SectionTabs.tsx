import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import {
  NavigationComponent,
  NavigationRouteConfigMap,
  NavigationScreenConfigProps,
  TabNavigatorConfig,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { WithNetworkError } from '../../components';
import theme from '../../theme';
import { PureScreen } from '../../utils/navigation';
import { SectionChartScreen } from './chart';
import container from './container';
import { SectionGuideScreen } from './guide';
import HeaderRight from './HeaderRight';
import SectionInfoScreen from './info';
import { SectionMapScreen } from './map';
import { SectionMediaScreen } from './media';
import SectionTitle from './SectionTitle';
import { InnerProps, NavParams, ScreenProps } from './types';

const routes: NavigationRouteConfigMap = {
  SectionMap: {
    screen: SectionMapScreen,
  },
  SectionChart: {
    screen: SectionChartScreen,
  },
  SectionInfo: {
    screen: SectionInfoScreen,
  },
  SectionGuide: {
    screen: SectionGuideScreen,
  },
  SectionMedia: {
    screen: SectionMediaScreen,
  },
};

const config: TabNavigatorConfig = {
  initialRouteName: 'SectionInfo',
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

const Navigator = createMaterialBottomTabNavigator(routes, config);

class SectionTabsView extends PureScreen<InnerProps, NavParams> {
  render() {
    const { navigation, section } = this.props;
    const screenProps: ScreenProps = { section };
    const { node, loading, error, refetch } = section;
    return (
      <WithNetworkError
        data={node}
        error={error}
        loading={loading}
        refetch={refetch}
      >
        <Navigator navigation={navigation} screenProps={screenProps} />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <WhitePortal name="section" />
        </View>
      </WithNetworkError>
    );
  }
}

export const SectionTabs: NavigationComponent & { router?: any } = container(
  SectionTabsView,
);
SectionTabs.router = Navigator.router;

SectionTabs.navigationOptions = ({
  navigation,
  screenProps,
}: NavigationScreenConfigProps) => ({
  headerTitle: <SectionTitle sectionId={navigation.getParam('sectionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});
