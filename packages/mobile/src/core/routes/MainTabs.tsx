import React from 'react';
import { NavigationNavigator, TabNavigator, TabNavigatorConfig } from 'react-navigation';
import { BurgerButton, Nothing } from '../../components';
import { RegionScreen, RegionsListScreen } from '../../screens';
import { Drawer } from './drawer';

const Routes = {
  RegionsList: {
    screen: RegionsListScreen,
  },
  Region: {
    screen: RegionScreen,
  },
};

const Config: TabNavigatorConfig = {
  tabBarComponent: Nothing,
  navigationOptions: {
    // TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24943
    headerLeft: (<BurgerButton />),
  },
};

const Navigator = TabNavigator(Routes, Config);

const MainTabs: NavigationNavigator = Object.assign(
  (props) => {
    return (
      <Drawer>
        <Navigator {...props} />
      </Drawer>
    );
  },
  {
    router: Navigator.router,
  },
);

export default MainTabs;
