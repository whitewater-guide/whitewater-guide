import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import Screens from '../screen-names';
import FilterButton from './FilterButton';
import { RegionInfoMenu } from './info';

const HeaderRight: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  switch (route) {
    case Screens.Region.SectionsList:
    case Screens.Region.Map:
      return <FilterButton navigation={navigation} />;
    case Screens.Region.Info:
      return <RegionInfoMenu regionId={navigation.getParam('regionId')} />;
  }
  return null;
};

export default HeaderRight;
