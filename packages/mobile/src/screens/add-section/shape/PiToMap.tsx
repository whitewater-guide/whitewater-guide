import Mapbox, { RegionChangeEvent } from '@react-native-mapbox-gl/maps';
import { ColorStrings, useSectionsList } from '@whitewater-guide/clients';
import React, { forwardRef, RefAttributes } from 'react';
import { BaseMap } from '~/components/map';
import { useMapboxData } from '~/components/map/hooks';
import { PUT_IN_PIN, TAKE_OUT_PIN } from '../../../assets';
import { PiToState } from './usePiToState';

const MapComponent = BaseMap as React.ComponentType<
  {
    onRegionDidChange?: (e: RegionChangeEvent) => void;
    onRegionIsChanging?: (e: RegionChangeEvent) => void;
    onRegionWillChange?: (e: RegionChangeEvent) => void;
    onPress?: () => void;
    regionDidChangeDebounceTime?: number;
    testID?: string;
  } & RefAttributes<Mapbox.MapView>
>;

const IMAGES = {
  putIn: PUT_IN_PIN,
  takeOut: TAKE_OUT_PIN,
};

const NO_POINT = {
  type: 'Point',
  coordinates: [180, 90],
};

const layerStyles: any = {
  sections: {
    lineColor: ColorStrings.none,
    lineWidth: 3,
  },
  names: {
    symbolPlacement: 'line-center',
    textField: ['get', 'name'],
    textSize: 12,
    textAnchor: 'bottom',
    textOffset: [0, 0.1],
  },
  arrows: {
    symbolPlacement: 'point',
    textRotationAlignment: 'map',
    textField: '>',
    textFont: ['whitewater guide Regular', 'Arial Unicode MS Regular'],
    textSize: ['interpolate', ['linear'], ['zoom'], 0, 5, 4, 10, 10, 20],
    textColor: ColorStrings.none,
    textRotate: ['get', 'arrowAzimuth'],
    textAllowOverlap: true,
  },
  putIn: {
    iconImage: ['get', 'icon'],
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
  },
  takeOut: {
    iconImage: ['get', 'icon'],
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
  },
};

interface Props extends PiToState {
  onRegionDidChange?: (e: RegionChangeEvent) => void;
  onRegionIsChanging?: (e: RegionChangeEvent) => void;
  onRegionWillChange?: (e: RegionChangeEvent) => void;
  onPress?: () => void;
}

const PiToMap = React.memo(
  forwardRef<Mapbox.MapView, Props>((props, ref) => {
    const { shape, selected, ...mapProps } = props;
    const sectionsList = useSectionsList();
    const { sections, pois, arrows } = useMapboxData(sectionsList.sections);

    const putIn = shape[0]
      ? {
          type: 'Feature',
          id: 'put-in-feature',
          properties: {
            icon: 'putIn',
          },
          geometry: {
            type: 'Point',
            coordinates: shape[0],
          },
        }
      : NO_POINT;
    const takeOut = shape[1]
      ? {
          type: 'Feature',
          id: 'take-out-feature',
          properties: {
            icon: 'takeOut',
          },
          geometry: {
            type: 'Point',
            coordinates: shape[1],
          },
        }
      : NO_POINT;
    const showPutIn = !!shape[0] && selected !== 0;
    const showTakeOut = !!shape[1] && selected !== 1;
    return (
      <MapComponent
        ref={ref}
        {...mapProps}
        regionDidChangeDebounceTime={0}
        testID="add-section-map"
      >
        <Mapbox.Images images={IMAGES} />

        <Mapbox.ShapeSource id="sections" shape={sections}>
          <Mapbox.LineLayer id="sections" style={layerStyles.sections} />
          <Mapbox.SymbolLayer id="names" style={layerStyles.names} />
        </Mapbox.ShapeSource>

        <Mapbox.ShapeSource id="arrows" shape={arrows}>
          <Mapbox.SymbolLayer id="arrows" style={layerStyles.arrows} />
        </Mapbox.ShapeSource>

        <Mapbox.ShapeSource id="putIn" shape={putIn}>
          <Mapbox.SymbolLayer
            id="putIn"
            style={{
              ...layerStyles.putIn,
              visibility: showPutIn ? 'visible' : 'none',
            }}
          />
        </Mapbox.ShapeSource>

        <Mapbox.ShapeSource id="takeOut" shape={takeOut}>
          <Mapbox.SymbolLayer
            id="takeOut"
            style={{
              ...layerStyles.takeOut,
              visibility: showTakeOut ? 'visible' : 'none',
            }}
          />
        </Mapbox.ShapeSource>
      </MapComponent>
    );
  }),
);

PiToMap.displayName = 'PiToMap';

export default PiToMap;
