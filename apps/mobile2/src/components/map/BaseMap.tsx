import { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import type { ComponentProps } from 'react';
import React, { forwardRef, useCallback } from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useCameraSetter, useInRegionLocation, useMapboxBounds } from './hooks';

type MapboxViewProps = ComponentProps<typeof MapView>;

interface MapViewProps {
  mapType: string;
  detailed?: boolean;
  locationPermissionGranted: boolean;
  initialBounds: CodegenCoordinates[];
  testID?: string;
}

type Props = MapViewProps & MapboxViewProps & { children?: React.ReactNode };

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

    // Rendering certain map parts/props only in active state should prevent
    // location access in background on Android
    const appState = useAppState();
    const setCamera = useCameraSetter();
    const bounds = useMapboxBounds(initialBounds);

    const onMapPress = useCallback(
      (e: any) => {
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
          defaultSettings={bounds.defaultSettings}
          animationDuration={0}
          animationMode="moveTo"
          allowUpdates={appState === 'active'}
        />

        {locationPermissionGranted && appState === 'active' && (
          <LocationPuck visible />
        )}

        {children}
      </MapView>
    );
  }),
);

BaseMap.displayName = 'BaseMap';
