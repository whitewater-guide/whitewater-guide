import React from 'react';
import {
  createNavigationContainer,
  createStackNavigator,
  NavigationNavigator,
  StackNavigatorConfig,
} from 'react-navigation';
import { NavigationNavigatorProps, NavigationRouter } from '../typings/react-navigation';
import { Drawer } from './components';
import { navigationChannel } from './core/sagas';
import { MyProfileScreen, PlainTextScreen, RegionScreen, RegionsListScreen } from './screens';

const Routes = {
  RegionsList: {
    screen: RegionsListScreen,
  },
  Region: {
    screen: RegionScreen,
  },
  Plain: {
    screen: PlainTextScreen,
  },
  MyProfile: {
    screen: MyProfileScreen,
  },
};

const Config: StackNavigatorConfig = {
  initialRouteName: 'RegionsList',
  navigationOptions: {
    headerStyle: { backgroundColor: '#FFFFFF' },
  },
};

const Navigator = createStackNavigator(Routes, Config);

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
