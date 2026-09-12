import type {
  CircleLayerStyle,
  LineLayerStyle,
  SymbolLayerStyle,
} from '@rnmapbox/maps';
import Mapbox from '@rnmapbox/maps';
import { memo } from 'react';
import { Platform } from 'react-native';

import { BaseMap } from './base-map';
import {
  useBoundsRef,
  useMapboxData,
  useMapboxSelectionFilter,
  useSelectionHandler,
} from './hooks';
import type { MapProps, MapViewProps } from './types';

const layerStyles: Record<
  string,
  CircleLayerStyle | LineLayerStyle | SymbolLayerStyle
> = {
  sections: {
    lineColor: ['get', 'color'],
    lineWidth: 3,
  },
  approximateSections: {
    lineColor: ['get', 'color'],
    lineWidth: 3,
    lineDasharray: [3, 1],
  },
  selectedSection: {
    lineColor: ['get', 'color'],
    lineWidth: 16,
    lineBlur: 8,
    lineOpacity: 0.5,
    lineCap: 'round',
  },
  pois: {
    circleRadius: ['interpolate', ['linear'], ['zoom'], 5, 2, 10, 6],
  },
  selectedPoi: {
    circleRadius: ['interpolate', ['linear'], ['zoom'], 5, 2, 10, 6],
    circleStrokeWidth: 2,
    circleStrokeColor: 'red',
  },
  arrow: {
    symbolPlacement: 'point',
    textRotationAlignment: 'map',
    textField: '>',
    textFont: ['whitewater guide Regular', 'Arial Unicode MS Regular'],
    textSize: ['interpolate', ['linear'], ['zoom'], 0, 5, 4, 10, 10, 20],
    textColor: ['get', 'color'],
    textRotate: ['get', 'arrowAzimuth'],
    textAllowOverlap: true,
  },
};

const ATTRIBUTION =
  Platform.OS === 'ios' ? { bottom: 8, left: 100 } : undefined;
const HIT_BOX = { width: 50, height: 50 };
const POI_FILTER = ['==', '$type', 'Point'] as const;
const APPROXIMATE_FILTER = ['==', ['get', 'approximate'], true] as const;
const NON_APPROXIMATE_FILTER = ['==', ['get', 'approximate'], false] as const;

export type FeaturesMapProps = MapProps & MapViewProps;

const FeaturesMap = memo((props: FeaturesMapProps) => {
  const {
    mapType,
    detailed,
    locationPermissionGranted,
    initialBounds,
    testID,
  } = props;
  const [visibleBounds, onMapIdle] = useBoundsRef(initialBounds);
  const onPress = useSelectionHandler(
    props.sections,
    props.pois,
    !props.detailed,
    visibleBounds,
  );
  const { sections, pois, arrows } = useMapboxData(
    props.sections,
    props.pois,
    detailed,
  );
  const idFilter = useMapboxSelectionFilter();
  return (
    <BaseMap
      mapType={mapType}
      detailed={detailed}
      initialBounds={initialBounds}
      locationPermissionGranted={locationPermissionGranted}
      onPress={onPress}
      onMapIdle={onMapIdle}
      attributionPosition={ATTRIBUTION}
      testID={testID}
    >
      <Mapbox.ShapeSource
        id="sectionsSource"
        shape={sections}
        onPress={detailed ? undefined : onPress}
        hitbox={HIT_BOX}
      >
        <Mapbox.LineLayer
          id="selectedSection"
          style={layerStyles.selectedSection as LineLayerStyle}
          filter={idFilter}
        />
        <Mapbox.LineLayer
          id="sections"
          aboveLayerID="selectedSection"
          style={layerStyles.sections as LineLayerStyle}
          filter={NON_APPROXIMATE_FILTER}
        />
        <Mapbox.LineLayer
          aboveLayerID="sections"
          id="sections-approximate"
          style={layerStyles.approximateSections as LineLayerStyle}
          filter={APPROXIMATE_FILTER}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="arrowsSource" shape={arrows} hitbox={HIT_BOX}>
        <Mapbox.SymbolLayer
          id="arrows"
          style={layerStyles.arrow as SymbolLayerStyle}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource
        id="poisSource"
        shape={pois}
        onPress={onPress}
        hitbox={HIT_BOX}
      >
        <Mapbox.CircleLayer
          aboveLayerID="arrows"
          id="pois"
          style={layerStyles.pois as CircleLayerStyle}
          filter={POI_FILTER}
        />
        <Mapbox.CircleLayer
          aboveLayerID="pois"
          id="selectedPoi"
          style={layerStyles.selectedPoi as CircleLayerStyle}
          filter={idFilter}
        />
      </Mapbox.ShapeSource>
    </BaseMap>
  );
});

FeaturesMap.displayName = 'FeaturesMap';

export default FeaturesMap;
