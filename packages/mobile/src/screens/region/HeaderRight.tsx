import { RegionConsumer } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import FilterButton from './FilterButton';
import { RegionInfoMenu } from './info';

const HeaderRight: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  switch (route) {
    case 'RegionSectionsList':
    case 'RegionMap':
      return <FilterButton navigation={navigation} />;
    case 'RegionInfo':
      return (
        <RegionConsumer>
          {({ region }) => <RegionInfoMenu region={region} />}
        </RegionConsumer>
      );
  }
  return null;
};

export default HeaderRight;
