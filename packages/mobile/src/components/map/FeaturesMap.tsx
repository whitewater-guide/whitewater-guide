import Mapbox, {
  CircleLayerStyle,
  LineLayerStyle,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps';
import { MapProps } from '@whitewater-guide/clients';
import { Point } from '@whitewater-guide/commons';
import React from 'react';
import { Platform } from 'react-native';
import { BaseMap } from './BaseMap';
import {
  useBoundsRef,
  useMapboxData,
  useMapboxSelectionFilter,
  useSelectionHandler,
} from './hooks';
import { MapViewProps } from './types';

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
const HIT_BOX = { width: 44, height: 44 };
const POI_FILTER = ['==', '$type', 'Point'];
// line-dasharray is not data-driven, split into 2 layers with filters
const APPROXIMATE_FILTER = ['==', ['get', 'approximate'], true];
const NON_APPROXIMATE_FILTER = ['==', ['get', 'approximate'], false];

type Props = MapProps & MapViewProps;

const FeaturesMap: React.FC<Props> = React.memo((props) => {
  const { mapType, detailed, locationPermissionGranted, initialBounds } = props;
  const [visibleBounds, onRegionDidChange] = useBoundsRef(initialBounds);
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
      onRegionDidChange={onRegionDidChange}
      attributionPosition={ATTRIBUTION}
    >
      <Mapbox.ShapeSource
        id="sectionsSource"
        shape={sections}
        onPress={detailed ? undefined : onPress}
        hitbox={HIT_BOX}
      >
        <Mapbox.LineLayer
          id="selectedSection"
          style={layerStyles.selectedSection}
          filter={idFilter}
        />
        <Mapbox.LineLayer
          id="sections"
          aboveLayerID="selectedSection"
          style={layerStyles.sections}
          filter={NON_APPROXIMATE_FILTER}
        />
        <Mapbox.LineLayer
          aboveLayerID="sections"
          id="sections-approximate"
          style={layerStyles.approximateSections}
          filter={APPROXIMATE_FILTER}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource id="arrowsSource" shape={arrows} hitbox={HIT_BOX}>
        <Mapbox.SymbolLayer id="arrows" style={layerStyles.arrow} />
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
          style={layerStyles.pois}
          filter={POI_FILTER}
        />
        <Mapbox.CircleLayer
          aboveLayerID="pois"
          id="selectedPoi"
          style={layerStyles.selectedPoi}
          filter={idFilter}
        />
      </Mapbox.ShapeSource>
    </BaseMap>
  );
});

FeaturesMap.displayName = 'FeaturesMap';

export default FeaturesMap;
