import React from 'react';
import { createMaterialBottomTabNavigator, NavigationRouteConfigMap, TabNavigatorConfig } from 'react-navigation';
import { NavigationComponent } from '../../../typings/react-navigation';
import { PureScreen } from '../../utils/navigation';
import { RegionSetter, WithRegion } from '../../ww-clients/features/regions';
import { WithSectionsList } from '../../ww-clients/features/sections';
import container from './container';
import RegionInfoScreen from './info';
import RegionMapScreen from './map';
import RegionTitle from './RegionTitle';
import RegionSectionsListScreen from './sections-list';
import SectionsProgress from './SectionsProgress';
import { ScreenProps } from './types';

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

const Navigator = createMaterialBottomTabNavigator(routes, config);

interface Params {
  regionId: string;
}

type Props = RegionSetter & WithRegion & WithSectionsList;

class RegionTabsView extends PureScreen<Props, Params> {

  render() {
    const { navigation, sections, region } = this.props;
    const screenProps: ScreenProps = { region, sections };
    return (
      <React.Fragment>
        <Navigator navigation={navigation} screenProps={screenProps} />
        <SectionsProgress loaded={sections.nodes.length} count={sections.count} />
      </React.Fragment>
    );
  }
}

export const RegionTabs: NavigationComponent & { router?: any} = container(RegionTabsView);
RegionTabs.router = Navigator.router;

RegionTabs.navigationOptions = ({ navigation }) => ({
  title: <RegionTitle regionId={navigation.getParam('regionId')}/>,
});
