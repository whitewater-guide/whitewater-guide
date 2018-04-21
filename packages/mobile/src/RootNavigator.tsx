import React from 'react';
import {
  createNavigationContainer,
  createStackNavigator,
  NavigationNavigatorProps,
  NavigationRouter,
  StackNavigatorConfig,
} from 'react-navigation';
import { Drawer } from './components';
import { navigationChannel } from './core/sagas';
import { MyProfileScreen, PlainTextScreen, RegionsListScreen, RegionTabs } from './screens';

const routes = {
  RegionsList: {
    screen: RegionsListScreen,
  },
  Region: {
    screen: RegionTabs,
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
  navigationOptions: ({ navigationOptions }) => ({
    ...navigationOptions,
    headerStyle: { backgroundColor: '#FFFFFF' },
  }),
};

const Navigator = createStackNavigator(routes, config);

class RootNavigatorView extends React.PureComponent<NavigationNavigatorProps> {
  static router: NavigationRouter<any, any> = Navigator.router;

  constructor(props: NavigationNavigatorProps) {
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
    return (
      <Drawer navigation={navigation as any}>
        <Navigator navigation={navigation} />
      </Drawer>
    );
  }
}

const RootNavigator = createNavigationContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
