import { useAppState } from '@react-native-community/hooks';
import {
  Camera,
  MapView,
  UserLocation,
  UserTrackingMode,
} from '@rnmapbox/maps';
import type { ComponentProps } from 'react';
import React, { forwardRef, useCallback } from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import { useCameraSetter, useInRegionLocation, useMapboxBounds } from './hooks';
import type { MapViewProps } from './types';

type MapboxViewProps = ComponentProps<typeof MapView>;
type Props = MapViewProps & MapboxViewProps & { children?: any };

export const BaseMap = React.memo(
  forwardRef<MapView, Props>((props, ref) => {
    const {
      mapType,
      detailed,
      locationPermissionGranted,
      initialBounds,
      children,
      onPress,
      ...mapboxProps
    } = props;
    // Rendering certain map parts/props only in active state should prevent location access in background on android
    // More here: https://github.com/react-native-mapbox-gl/maps/discussions/1362
    const appState = useAppState();
    const setCamera = useCameraSetter();
    const bounds = useMapboxBounds(props.initialBounds);
    const onMapPress = useCallback(
      (e: GeoJSON.Feature) => {
        Keyboard.dismiss();
        onPress?.(e);
      },
      [onPress],
    );

    if (!detailed) {
      // detailed should not change during map existence
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useInRegionLocation(initialBounds, locationPermissionGranted, appState);
    }
    return (
      <MapView
        ref={ref}
        localizeLabels
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        styleURL={mapType}
        style={StyleSheet.absoluteFill}
        onPress={onMapPress}
        {...mapboxProps}
      >
        <Camera
          ref={setCamera}
          {...bounds}
          animationDuration={0}
          animationMode="moveTo"
          // Properties below are intended to fix location acces in background on Android
          allowUpdates={appState === 'active'}
          followUserMode={UserTrackingMode.Follow}
          followUserLocation={false}
        />

        {locationPermissionGranted && appState === 'active' && (
          <UserLocation visible />
        )}

        {children}
      </MapView>
    );
  }),
);

BaseMap.displayName = 'BaseMap';
