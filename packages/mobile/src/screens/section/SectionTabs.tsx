import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
} from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  NavigationRouteConfigMap,
  NavigationRouter,
  NavigationScreenComponent,
  TabNavigatorConfig,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { WithNetworkError } from '../../components';
import { SelectedPOIView } from '../../components/map';
import theme from '../../theme';
import Screens from '../screen-names';
import { SectionChartScreen } from './chart';
import { SectionGuideScreen } from './guide';
import HeaderRight from './HeaderRight';
import SectionInfoScreen from './info';
import { SectionMapScreen } from './map';
import { SectionMediaScreen } from './media';
import { SECTION_DETAILS } from './sectionDetails.query';
import SectionTitle from './SectionTitle';
import { NavParams } from './types';

const routes: NavigationRouteConfigMap = {
  [Screens.Section.Map]: {
    screen: SectionMapScreen,
  },
  [Screens.Section.Chart]: {
    screen: SectionChartScreen,
  },
  [Screens.Section.Info]: {
    screen: SectionInfoScreen,
  },
  [Screens.Section.Guide]: {
    screen: SectionGuideScreen,
  },
  [Screens.Section.Media]: {
    screen: SectionMediaScreen,
  },
};

const config: TabNavigatorConfig = {
  initialRouteName: Screens.Section.Info,
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

export const SectionTabs: NavigationScreenComponent<NavParams> & {
  router: NavigationRouter;
} = ({ navigation }) => {
  const regionId = navigation.getParam('regionId');
  const sectionId = navigation.getParam('sectionId');
  if (!regionId || !sectionId) {
    return null;
  }
  return (
    <RegionProvider
      regionId={regionId}
      bannerWidth={theme.screenWidthPx}
      fetchPolicy="cache-only"
    >
      <SectionProvider sectionId={sectionId} query={SECTION_DETAILS}>
        {({ node, error, loading, refetch }) => (
          <WithNetworkError
            data={node}
            error={error}
            loading={loading}
            refetch={refetch}
          >
            <MapSelectionProvider>
              <Navigator navigation={navigation} />
              <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <SelectedPOIView />
              </View>
            </MapSelectionProvider>
          </WithNetworkError>
        )}
      </SectionProvider>
    </RegionProvider>
  );
};

SectionTabs.router = Navigator.router;

SectionTabs.navigationOptions = ({ navigation }) => ({
  headerTitle: <SectionTitle sectionId={navigation.getParam('sectionId')} />,
  headerRight: <HeaderRight navigation={navigation} />,
});
