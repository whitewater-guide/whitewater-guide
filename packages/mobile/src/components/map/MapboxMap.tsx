import Mapbox, {
  CircleLayerStyle,
  LineLayerStyle,
  RegionChangeEvent,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps';
import { MapProps } from '@whitewater-guide/clients';
import { Point } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  useBoundsRef,
  useCameraSetter,
  useInRegionLocation,
  useMapboxData,
  useMapboxSelectionFilter,
  useSelectionHandler,
} from './hooks';

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

const HIT_BOX = { width: 44, height: 44 };
const POI_FILTER = ['==', '$type', 'Point'];
// line-dasharray is not data-driven, split into 2 layers with filters
const APPROXIMATE_FILTER = ['==', ['get', 'approximate'], true];
const NON_APPROXIMATE_FILTER = ['==', ['get', 'approximate'], false];

interface Props extends MapProps {
  mapType: string;
  detailed?: boolean;
  showUserLocation: boolean;
}

const MapboxMap: React.FC<Props> = React.memo((props) => {
  const { mapType, detailed, showUserLocation, initialBounds } = props;
  const [visibleBounds, onRegionDidChange] = useBoundsRef(initialBounds);
  const setCamera = useCameraSetter();
  const onPress = useSelectionHandler(
    props.sections,
    props.pois,
    !props.detailed,
    visibleBounds,
  );
  const { defaultSettings, sections, pois, arrows } = useMapboxData(
    props,
    detailed,
  );
  if (!detailed) {
    // detailed should not change during map existence
    useInRegionLocation(initialBounds);
  }
  const idFilter = useMapboxSelectionFilter();
  return (
    <Mapbox.MapView
      localizeLabels={true}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      showUserLocation={showUserLocation}
      styleURL={mapType}
      style={StyleSheet.absoluteFill}
      onPress={onPress}
      onRegionDidChange={onRegionDidChange}
    >
      <Mapbox.Camera
        ref={setCamera}
        defaultSettings={defaultSettings}
        animationDuration={0}
        animationMode="moveTo"
      />

      <Mapbox.UserLocation visible={showUserLocation} />

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
    </Mapbox.MapView>
  );
});

MapboxMap.displayName = 'MapboxMap';

export default MapboxMap;
