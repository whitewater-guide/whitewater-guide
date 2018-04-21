import noop from 'lodash/noop'
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
        onPOISelected={noop}
        onSectionSelected={noop}
        sections={sections.nodes}
        contentBounds={region.node.bounds}
        initialBounds={region.node.bounds}
        pois={region.node.pois}
        selectedPOIId={null}
        selectedSectionId={null}
        useSectionShapes={false}
      />
    </Screen>
  );
};

// RegionMapScreen.navigationOptions = {
//   tabBarLabel: <I18nText>region:map.title</I18nText>,
// };
