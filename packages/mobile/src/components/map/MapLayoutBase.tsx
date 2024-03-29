import type Mapbox from '@rnmapbox/maps';
import type { FC, MutableRefObject, PropsWithChildren } from 'react';
import React from 'react';
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
import type { MapViewProps } from './types';

interface Props {
  detailed?: boolean;
  initialBounds: CodegenCoordinates[];
  mapView: React.ReactElement<MapViewProps>;
  cameraRef?: MutableRefObject<Mapbox.Camera | null>;
}

export const MapLayoutBase: FC<PropsWithChildren<Props>> = React.memo(
  (props) => {
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
  },
);

MapLayoutBase.displayName = 'MapLayoutBase';
