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
    const setCamera = useCameraSetter();
    const bounds = useMapboxBounds(props.initialBounds);
    const onMapPress = useCallback(
      (e) => {
        Keyboard.dismiss();
        if (onPress) {
          onPress(e);
        }
      },
      [onPress],
    );
    if (!detailed) {
      // detailed should not change during map existence
      useInRegionLocation(initialBounds, locationPermissionGranted);
    }
    return (
      <Mapbox.MapView
        ref={ref}
        localizeLabels={true}
        pitchEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        showUserLocation={locationPermissionGranted}
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
        />

        <Mapbox.UserLocation visible={locationPermissionGranted} />

        {children}
      </Mapbox.MapView>
    );
  }),
);

BaseMap.displayName = 'BaseMap';
