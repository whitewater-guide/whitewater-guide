import React from 'react';
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
import { MyProfileScreen, PlainTextScreen, RegionScreen, RegionsListScreen, SectionTabs } from './screens';
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
};

const config: StackNavigatorConfig = {
  initialRouteName: 'RegionsList',
  navigationOptions: () => ({
    header: renderHeader,
    headerStyle: { backgroundColor: '#FFFFFF' },
  }),
};

const Navigator = createStackNavigator(routes, config);

type Props = NavigationNavigatorProps<{}, NavigationState>;

class RootNavigatorView extends React.PureComponent<Props> {
  static router: NavigationRouter<any, any> = Navigator.router;

  constructor(props: Props) {
    super(props);
    navigationChannel.dispatch = props.navigation.dispatch;
  }

  componentWillReceiveProps(nexProps: NavigationNavigatorProps) {
    if (nexProps.navigation.dispatch !== this.props.navigation.dispatch) {
      navigationChannel.dispatch = nexProps.navigation.dispatch;
    }
  }

  render() {
    const { navigation } = this.props;
    const regionRoute = navigation.state.routes.find((route: NavigationRoute) => route.routeName === 'Region');
    const regionId = regionRoute ? regionRoute.params.regionId : undefined;
    return (
      <RegionProvider regionId={regionId}>
        <Drawer navigation={navigation as any}>
          <Navigator navigation={navigation} />
        </Drawer>
      </RegionProvider>
    );
  }
}

const RootNavigator = createNavigationContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
