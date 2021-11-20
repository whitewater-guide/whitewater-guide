import { useAppState } from '@react-native-community/hooks';
import Mapbox, { MapboxViewProps } from '@react-native-mapbox-gl/maps';
import React, { forwardRef, useCallback } from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import { useCameraSetter, useInRegionLocation, useMapboxBounds } from './hooks';
import { MapViewProps } from './types';

type Props = MapViewProps & MapboxViewProps & { children?: any };

export const BaseMap = React.memo(
  forwardRef<Mapbox.MapView, Props>((props, ref) => {
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
      (e) => {
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
      <Mapbox.MapView
        ref={ref}
        localizeLabels
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        styleURL={mapType}
        style={StyleSheet.absoluteFill}
        onPress={onMapPress}
        {...mapboxProps}
      >
        <Mapbox.Camera
          ref={setCamera}
          {...bounds}
          animationDuration={0}
          animationMode="moveTo"
          // Properties below are intended to fix location acces in background on Android
          allowUpdates={appState === 'active'}
          followUserMode="normal"
          followUserLocation={false}
        />

        {locationPermissionGranted && appState === 'active' && (
          <Mapbox.UserLocation visible />
        )}

        {children}
      </Mapbox.MapView>
    );
  }),
);

BaseMap.displayName = 'BaseMap';
