import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import { Map } from 'components/map';
import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';

const RegionMapScreen: NavigationScreenComponent = () => {
  const { node } = useRegion();
  const { sections } = useSectionsList();
  return (
    <Screen>
      {node && (
        <Map pois={node.pois} sections={sections} initialBounds={node.bounds} />
      )}
    </Screen>
  );
};

export default RegionMapScreen;
