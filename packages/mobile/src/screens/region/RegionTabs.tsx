import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import { createMaterialBottomTabNavigator, NavigationRouteConfigMap, TabNavigatorConfig } from 'react-navigation';
import { NavigationComponent } from '../../../typings/react-navigation';
import theme from '../../theme';
import { PureScreen } from '../../utils/navigation';
import container from './container';
import RegionInfoScreen from './info';
import RegionMapScreen from './map';
import RegionTitle from './RegionTitle';
import RegionSectionsListScreen from './sections-list';
import SectionsProgress from './SectionsProgress';
import { InnerProps, NavParams, ScreenProps } from './types';

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
  tabBarOptions: {
    activeTintColor: theme.colors.textLight,
  },
  // Not yet in typedefs
  barStyle: {
    backgroundColor: theme.colors.primary,
  },
  shifting: true,
} as any;

const Navigator = createMaterialBottomTabNavigator(routes, config);

class RegionTabsView extends PureScreen<InnerProps, NavParams> {

  componentDidMount() {
    this.props.selectRegion({ regionId: this.props.region.node.id });
  }

  componentWillUnmount() {
    this.props.selectRegion({ regionId: null });
  }

  render() {
    const { navigation, sections, region } = this.props;
    const screenProps: ScreenProps = { region, sections };
    return (
      <React.Fragment>
        <Navigator navigation={navigation} screenProps={screenProps} />
        <SectionsProgress loaded={sections.nodes.length} count={sections.count} />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <WhitePortal name="region" />
        </View>
      </React.Fragment>
    );
  }
}

export const RegionTabs: NavigationComponent & { router?: any} = container(RegionTabsView);
RegionTabs.router = Navigator.router;

RegionTabs.navigationOptions = ({ navigation }) => ({
  title: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
