import Drawer from 'components/drawer';
import { getHeaderRenderer } from 'components/header';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createAppContainer, NavigationNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { navigationChannel } from './core/sagas';
import { useLinking } from './core/useLinking';
import { OfflineContentDialog } from './features/offline';
import { AuthStack } from './screens/auth';
import { LazyFilterScreen } from './screens/filter';
import { LazyMyProfileScreen } from './screens/my-profile';
import { LazyPlainScreen } from './screens/plain';
import { PurchaseStack } from './screens/purchase';
import { RegionScreen } from './screens/region';
import { RegionsListScreen } from './screens/regions-list';
import Screens from './screens/screen-names';
import { SectionTabs } from './screens/section';
import { LazySuggestionScreen } from './screens/suggestion';
import { LazyWebViewScreen } from './screens/webview';
import { StackNavigatorConfig } from './utils/navigation';

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
    screen: LazyPlainScreen,
  },
  [Screens.WebView]: {
    screen: LazyWebViewScreen,
  },
  [Screens.MyProfile]: {
    screen: LazyMyProfileScreen,
  },
  [Screens.Filter]: {
    screen: LazyFilterScreen,
  },
  [Screens.Suggestion]: {
    screen: LazySuggestionScreen,
  },
  [Screens.Auth.Root]: {
    screen: AuthStack,
  },
  [Screens.Purchase.Root]: {
    screen: PurchaseStack,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.RegionsList,
  headerMode: 'screen',
  defaultNavigationOptions: () => ({
    header: getHeaderRenderer(),
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
  return (
    <Drawer>
      <View style={StyleSheet.absoluteFill}>
        <Navigator navigation={navigation} />
        <OfflineContentDialog />
      </View>
    </Drawer>
  );
};

RootNavigatorView.router = Navigator.router;

const RootNavigator = createAppContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
