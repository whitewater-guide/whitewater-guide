import Mapbox, { type MapState } from '@rnmapbox/maps';
import { ColorStrings, useSectionsList } from '@whitewater-guide/clients';
import { forwardRef, memo } from 'react';
import { Image, Platform } from 'react-native';

import { PUT_IN_PIN, TAKE_OUT_PIN } from '../../../assets';
import { BaseMap } from '../../../components/map/BaseMap';
import { useMapboxData } from '../../../components/map/hooks';
import type { PiToState } from './usePiToState';

type RegionChangeEvent = GeoJSON.Feature<GeoJSON.Point>;

const IMAGES = {
  putIn: PUT_IN_PIN,
  takeOut: TAKE_OUT_PIN,
};

const NO_POINT: GeoJSON.Point = {
  type: 'Point',
  coordinates: [180, 90],
};

const layerStyles = {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

interface Props extends PiToState {
  mapType: string;
  locationPermissionGranted: boolean;
  initialBounds: CodegenCoordinates[];
  onMapIdle?: (state: MapState) => void;
  onRegionIsChanging?: (e: RegionChangeEvent) => void;
  onPress?: () => void;
}

const PiToMap = memo(
  forwardRef<Mapbox.MapView, Props>((props, ref) => {
    const { shape, selected, ...mapProps } = props;
    const sectionsList = useSectionsList();
    const { sections, arrows } = useMapboxData(sectionsList.sections ?? []);

    const putIn: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point = shape[0]
      ? {
          type: 'Feature',
          id: 'put-in-feature',
          properties: { icon: 'putIn' },
          geometry: {
            type: 'Point',
            coordinates: shape[0] as unknown as GeoJSON.Position,
          },
        }
      : NO_POINT;
    const takeOut: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point = shape[1]
      ? {
          type: 'Feature',
          id: 'take-out-feature',
          properties: { icon: 'takeOut' },
          geometry: {
            type: 'Point',
            coordinates: shape[1] as unknown as GeoJSON.Position,
          },
        }
      : NO_POINT;
    const showPutIn = !!shape[0] && selected !== 0;
    const showTakeOut = !!shape[1] && selected !== 1;
    return (
      <BaseMap ref={ref} {...mapProps} testID="add-section-map">
        {Platform.OS === 'ios' ? (
          <Mapbox.Images>
            <Mapbox.Image name="putIn">
              <Image source={require('../../../assets/putInPin.png')} />
            </Mapbox.Image>
            <Mapbox.Image name="takeOut">
              <Image source={require('../../../assets/takeOutPin.png')} />
            </Mapbox.Image>
          </Mapbox.Images>
        ) : (
          <Mapbox.Images images={IMAGES} />
        )}

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
      </BaseMap>
    );
  }),
);

PiToMap.displayName = 'PiToMap';

export default PiToMap;
