import { MapProps } from '@whitewater-guide/clients';
import React from 'react';

import FeaturesMap from './FeaturesMap';
import { MapLayoutBase } from './MapLayoutBase';

// Other FeaturesMap props will be passed from MapLayoutBase
const MapComponent = FeaturesMap as React.ComponentType<{
  sections: MapProps['sections'];
  pois: MapProps['pois'];
  testID?: string;
}>;

interface Props extends MapProps {
  detailed?: boolean;
  testID?: string;
}

export const Map: React.FC<Props> = React.memo((props) => {
  const { detailed, initialBounds, pois, sections, testID } = props;
  return (
    <MapLayoutBase
      initialBounds={initialBounds}
      detailed={detailed}
      mapView={<MapComponent pois={pois} sections={sections} testID={testID} />}
    />
  );
});

Map.displayName = 'Map';
