import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import Screens from '../screen-names';
import FilterButton from './FilterButton';
import { LazyRegionInfoMenu } from './info';

const HeaderRight: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  switch (route) {
    case Screens.Region.Tabs.SectionsList:
    case Screens.Region.Tabs.Map:
      return <FilterButton navigation={navigation} />;
    case Screens.Region.Tabs.Info:
      return <LazyRegionInfoMenu regionId={navigation.getParam('regionId')} />;
  }
  return null;
};

export default HeaderRight;
