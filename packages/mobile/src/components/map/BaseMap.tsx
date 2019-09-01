import Mapbox, { MapboxViewProps } from '@react-native-mapbox-gl/maps';
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { useCameraSetter, useInRegionLocation, useMapboxBounds } from './hooks';
import { MapViewProps } from './types';

type Props = MapViewProps & MapboxViewProps;

export const BaseMap = React.memo(
  forwardRef<Mapbox.MapView, Props>((props, ref) => {
    const {
      mapType,
      detailed,
      locationPermissionGranted,
      initialBounds,
      children,
      ...mapboxProps
    } = props;
    const setCamera = useCameraSetter();
    const bounds = useMapboxBounds(props.initialBounds);
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
