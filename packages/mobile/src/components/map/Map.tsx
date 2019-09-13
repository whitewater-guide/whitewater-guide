import { MapProps } from '@whitewater-guide/clients';
import { Point, Section } from '@whitewater-guide/commons';
import React from 'react';
import FeaturesMap from './FeaturesMap';
import { MapLayoutBase } from './MapLayoutBase';

// Other FeaturesMap props will be passed from MapLayoutBase
const MapComponent = FeaturesMap as React.ComponentType<{
  sections: Section[];
  pois: Point[];
}>;

interface Props extends MapProps {
  detailed?: boolean;
}

export const Map: React.FC<Props> = React.memo((props) => {
  const { detailed, initialBounds, pois, sections } = props;
  return (
    <MapLayoutBase
      initialBounds={initialBounds}
      detailed={detailed}
      mapView={<MapComponent pois={pois} sections={sections} />}
    />
  );
});

Map.displayName = 'Map';
