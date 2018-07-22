import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  createNavigationContainer,
  createStackNavigator,
  NavigationNavigatorProps,
  NavigationRoute,
  NavigationRouter,
  NavigationState,
  StackNavigatorConfig,
} from 'react-navigation';
import { Drawer } from './components';
import { renderHeader } from './components/header';
import { navigationChannel } from './core/sagas';
import { PremiumDialog } from './features/purchases';
import {
  FilterScreen,
  MyProfileScreen,
  PlainTextScreen,
  RegionScreen,
  RegionsListScreen,
  SectionTabs,
} from './screens';
import { PaperTheme } from './theme';
import { RegionProvider } from './ww-clients/features/regions';

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
};

const config: StackNavigatorConfig = {
  initialRouteName: 'RegionsList',
  navigationOptions: () => ({
    header: renderHeader,
    headerStyle: { backgroundColor: '#FFFFFF' },
    gesturesEnabled: false,
  }),
};

const Navigator = createStackNavigator(routes, config);

type Props = NavigationNavigatorProps<{}, NavigationState>;

class RootNavigatorView extends React.PureComponent<Props> {
  static router: NavigationRouter<any, any> = Navigator.router;

  constructor(props: Props) {
    super(props);
    navigationChannel.dispatch = props.navigation!.dispatch;
  }

  componentWillReceiveProps(nexProps: NavigationNavigatorProps) {
    if (nexProps.navigation!.dispatch !== this.props.navigation!.dispatch) {
      navigationChannel.dispatch = nexProps.navigation!.dispatch;
    }
  }

  render() {
    const { navigation } = this.props;
    const regionRoute = navigation!.state.routes.find((route: NavigationRoute) => route.routeName === 'Region');
    const regionId = (regionRoute && regionRoute.params) ? regionRoute.params.regionId : undefined;
    // PaperProvider needs to be innermost provider, so dialogs can consume from other providers
    return (
      <RegionProvider regionId={regionId}>
        <PaperProvider theme={PaperTheme}>
          <Drawer navigation={navigation as any}>
            <View style={StyleSheet.absoluteFill}>
              <Navigator navigation={navigation as any} />
              <PremiumDialog />
            </View>
          </Drawer>
        </PaperProvider>
      </RegionProvider>
    );
  }
}

const RootNavigator = createNavigationContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
