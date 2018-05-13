import React from 'react';
import {
  createNavigationContainer,
  createStackNavigator,
  NavigationNavigatorProps,
  NavigationRouter,
  StackNavigatorConfig,
} from 'react-navigation';
import { Drawer } from './components';
import { renderHeader } from './components/header';
import { navigationChannel } from './core/sagas';
import { MyProfileScreen, PlainTextScreen, RegionScreen, RegionsListScreen, SectionTabs } from './screens';

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
