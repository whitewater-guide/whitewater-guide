import React from 'react';
import { TabNavigator } from 'react-navigation';
import { RegionScreen, RegionsListScreen } from '../../screens';

const Routes = {
  RegionsList: {
    screen: RegionsListScreen,
  },
  Region: {
    screen: RegionScreen,
  },
};

export default TabNavigator(Routes);
