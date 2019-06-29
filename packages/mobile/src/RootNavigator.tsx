import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  createAppContainer,
  createStackNavigator,
  NavigationNavigator,
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
import Screens from './screens/screen-names';
import { PaperTheme } from './theme';

const routes = {
  [Screens.RegionsList]: {
    screen: RegionsListScreen,
  },
  [Screens.Region.Root]: {
    screen: RegionScreen,
  },
  [Screens.Section.Root]: {
    screen: SectionTabs,
  },
  [Screens.Plain]: {
    screen: PlainTextScreen,
  },
  [Screens.MyProfile]: {
    screen: MyProfileScreen,
  },
  [Screens.Filter]: {
    screen: FilterScreen,
  },
  ...AuthRoutes,
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.RegionsList,
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
  // PaperProvider needs to be innermost provider, so dialogs can consume from other providers
  return (
    <PaperProvider theme={PaperTheme}>
      <Drawer>
        <View style={StyleSheet.absoluteFill}>
          <Navigator navigation={navigation} />
          <PremiumDialog />
          <OfflineContentDialog />
        </View>
      </Drawer>
    </PaperProvider>
  );
};

RootNavigatorView.router = Navigator.router;

const RootNavigator = createAppContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
