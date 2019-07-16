import { MapProps } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMapType } from '../../features/settings';
import { Loading } from '../Loading';
import CameraControls from './CameraControls';
import {
  CameraProvider,
  LocationPermission,
  useLocationPermission,
} from './hooks';
import Layers from './layers';
import LayersSelector from './LayersSelector';
import MapboxMap from './MapboxMap';

interface Props extends MapProps {
  detailed?: boolean;
}

export const MapLayout: React.FC<Props> = React.memo((props) => {
  const { mapType } = useMapType();
  const permissionStatus = useLocationPermission();
  const showUserLocation = permissionStatus === LocationPermission.GRANTED;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {permissionStatus === LocationPermission.FETCHING ? (
        <Loading />
      ) : (
        <CameraProvider>
          <MapboxMap
            {...props}
            mapType={mapType || Layers.TERRAIN.url}
            showUserLocation={showUserLocation}
          />
          <LayersSelector />
          <CameraControls
            showUserLocation={showUserLocation}
            initialBounds={props.initialBounds}
          />
        </CameraProvider>
      )}
    </View>
  );
});

MapLayout.displayName = 'MapLayout';
