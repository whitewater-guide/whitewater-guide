import { RegionProvider } from '@whitewater-guide/clients';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  createAppContainer,
  createStackNavigator,
  NavigationNavigator,
  NavigationRoute,
  StackNavigatorConfig,
} from 'react-navigation';
import { Drawer } from './components';
import { renderHeader } from './components/header';
import { navigationChannel } from './core/sagas';
import { useLinking } from './core/useLinking';
import { OfflineContentDialog } from './features/offline';
import { PremiumDialog } from './features/purchases';
import {
  AuthRoutes,
  FilterScreen,
  MyProfileScreen,
  PlainTextScreen,
  RegionScreen,
  RegionsListScreen,
  SectionTabs,
} from './screens';
import theme, { PaperTheme } from './theme';

const routes = {
  RegionsList: {
    screen: RegionsListScreen,
  },
  Region: {
    screen: RegionScreen,
  },
  Section: {
    screen: SectionTabs,
  },
  Plain: {
    screen: PlainTextScreen,
  },
  MyProfile: {
    screen: MyProfileScreen,
  },
  Filter: {
    screen: FilterScreen,
  },
  ...AuthRoutes,
};

const config: StackNavigatorConfig = {
  initialRouteName: 'RegionsList',
  defaultNavigationOptions: () => ({
    header: renderHeader,
    headerBackTitle: null,
    gesturesEnabled: false,
  }),
};

const Navigator = createStackNavigator(routes, config);

const RootNavigatorView: NavigationNavigator<any, any, any> = ({
  navigation,
}) => {
  useLinking(navigation);
  useEffect(() => {
    navigationChannel.dispatch = navigation.dispatch;
  }, [navigation.dispatch]);
  const regionRoute = navigation!.state.routes.find(
    (route: NavigationRoute) => route.routeName === 'Region',
  );
  const regionId =
    regionRoute && regionRoute.params ? regionRoute.params.regionId : undefined;
  // PaperProvider needs to be innermost provider, so dialogs can consume from other providers
  return (
    <RegionProvider regionId={regionId} bannerWidth={theme.screenWidthPx}>
      <PaperProvider theme={PaperTheme}>
        <Drawer>
          <View style={StyleSheet.absoluteFill}>
            <Navigator navigation={navigation} />
            <PremiumDialog />
            <OfflineContentDialog />
          </View>
        </Drawer>
      </PaperProvider>
    </RegionProvider>
  );
};

RootNavigatorView.router = Navigator.router;

const RootNavigator = createAppContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
