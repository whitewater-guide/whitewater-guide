import {
  MapSelectionProvider,
  useSectionsList,
} from '@whitewater-guide/clients';
import React from 'react';
import {
  NavigationRouteConfigMap,
  NavigationRouter,
  NavigationScreenComponent,
  TabNavigatorConfig,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { SelectedPOIView, SelectedSectionView } from '../../components/map';
import theme from '../../theme';
import Screens from '../screen-names';
import AddSectionFAB from './AddSectionFAB';
import HeaderRight from './HeaderRight';
import { RegionInfoScreen } from './info';
import RegionMapScreen from './map';
import RegionTitle from './RegionTitle';
import RegionSectionsListScreen from './sections-list';
import SectionsProgress from './SectionsProgress';

const routes: NavigationRouteConfigMap = {
  [Screens.Region.Tabs.Map]: {
    screen: RegionMapScreen,
  },
  [Screens.Region.Tabs.SectionsList]: {
    screen: RegionSectionsListScreen,
  },
  [Screens.Region.Tabs.Info]: {
    screen: RegionInfoScreen,
  },
};

const config: TabNavigatorConfig = {
  initialRouteName: Screens.Region.Tabs.Map,
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

type NavComponent = NavigationScreenComponent & {
  router?: NavigationRouter;
};

const RegionTabs: NavComponent = React.memo((props) => {
  const { navigation } = props;
  const sectionsList = useSectionsList();
  return (
    <MapSelectionProvider>
      <Navigator navigation={navigation} />
      <AddSectionFAB />
      <SelectedPOIView />
      <SelectedSectionView />
      <SectionsProgress
        status={sectionsList.status}
        loaded={sectionsList.sections.length}
        count={sectionsList.count}
      />
    </MapSelectionProvider>
  );
});

RegionTabs.displayName = 'RegionTabs';
RegionTabs.router = Navigator.router;
RegionTabs.navigationOptions = ({ navigation }) => ({
  headerTitle: <RegionTitle regionId={navigation.getParam('regionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});

export default RegionTabs;
