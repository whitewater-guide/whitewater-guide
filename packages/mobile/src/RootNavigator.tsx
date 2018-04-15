import React from 'react';
import { createNavigationContainer, NavigationNavigator, StackNavigator, StackNavigatorConfig } from 'react-navigation';
import { Drawer } from './components';
import { PlainTextScreen, RegionScreen, RegionsListScreen } from './screens';

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
};

const Config: StackNavigatorConfig = {
  initialRouteName: 'RegionsList',
};

const Navigator = StackNavigator(Routes, Config);

const RootNavigatorView: NavigationNavigator = Object.assign(
  (props) => (
    <Drawer navigation={props.navigation}>
      <Navigator {...props} />
    </Drawer>
  ),
  { router: Navigator.router },
);

const RootNavigator = createNavigationContainer(RootNavigatorView);
RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
