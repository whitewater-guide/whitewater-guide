import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../components';
import { ScreenProps } from '../types';
import RegionMap from './RegionMap';

export const RegionMapScreen: NavigationScreenComponent = ({ screenProps }) => {
  const { region, sections }: ScreenProps = screenProps as any;
  return (
    <Screen noScroll>
      <RegionMap
        region={region.node}
        sections={sections.nodes}
      />
    </Screen>
  );
};

// RegionMapScreen.navigationOptions = {
//   tabBarLabel: <I18nText>region:map.title</I18nText>,
// };
