import Mapbox from '@react-native-mapbox-gl/maps';
import { CoordinateLoose } from '@whitewater-guide/commons';
import React, { MutableRefObject } from 'react';
import { StyleSheet, View } from 'react-native';

import { useMapType } from '../../features/settings';
import Loading from '../Loading';
import CameraControls from './CameraControls';
import {
  CameraProvider,
  LocationPermission,
  useLocationPermission,
} from './hooks';
import LayersSelector from './LayersSelector';
import { MapViewProps } from './types';

interface Props {
  detailed?: boolean;
  initialBounds: CoordinateLoose[];
  mapView: React.ReactElement<MapViewProps>;
  cameraRef?: MutableRefObject<Mapbox.Camera | null>;
}

export const MapLayoutBase: React.FC<Props> = React.memo((props) => {
  const { initialBounds, detailed, mapView, cameraRef, children } = props;
  const { mapType } = useMapType();
  const permissionStatus = useLocationPermission();
  const locationPermissionGranted =
    permissionStatus === LocationPermission.GRANTED;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {permissionStatus === LocationPermission.FETCHING ? (
        <Loading />
      ) : (
        <CameraProvider cameraRef={cameraRef}>
          {React.cloneElement(mapView, {
            mapType,
            initialBounds,
            detailed,
            locationPermissionGranted,
          })}
          {children}
          <LayersSelector />
          <CameraControls
            locationPermissionGranted={locationPermissionGranted}
            initialBounds={props.initialBounds}
          />
        </CameraProvider>
      )}
    </View>
  );
});

MapLayoutBase.displayName = 'MapLayoutBase';
