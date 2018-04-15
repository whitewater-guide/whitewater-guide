import React from 'react';
import { createNavigationContainer, NavigationNavigator, StackNavigator, StackNavigatorConfig } from 'react-navigation';
import { PlainTextScreen, RegionScreen, RegionsListScreen } from '../../screens';
import { Drawer } from './drawer';

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

export const RootNavigator = createNavigationContainer(RootNavigatorView);
