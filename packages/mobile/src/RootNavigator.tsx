import React from 'react';
import {
  createNavigationContainer,
  createStackNavigator,
  NavigationNavigator,
  StackNavigatorConfig,
} from 'react-navigation';
import { Drawer } from './components';
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
};

const Navigator = createStackNavigator(Routes, Config);

const RootNavigatorView: NavigationNavigator = Object.assign(
  (props) => (
    <Drawer navigation={props.navigation}>
      <Navigator navigation={props.navigation} />
    </Drawer>
  ),
  { router: Navigator.router },
);

const RootNavigator = createNavigationContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
