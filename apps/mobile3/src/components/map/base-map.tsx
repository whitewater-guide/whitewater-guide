import type { MapView as MapboxMapView } from '@rnmapbox/maps';
import { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import type { ComponentProps } from 'react';
import { forwardRef, memo, useCallback } from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import { useCameraSetter, useInRegionLocation, useMapboxBounds } from './hooks';
import type { MapViewProps } from './types';

import { useAppState } from '@/hooks/use-app-state';

type MapboxViewProps = ComponentProps<typeof MapView>;

export type BaseMapProps = MapViewProps &
  MapboxViewProps & { children?: React.ReactNode };

export const BaseMap = memo(
  forwardRef<MapboxMapView, BaseMapProps>((props, ref) => {
    const {
      mapType,
      detailed,
      locationPermissionGranted,
      initialBounds,
      children,
      onPress,
      ...mapboxProps
    } = props;

    const appState = useAppState();
    const setCamera = useCameraSetter();
    const bounds = useMapboxBounds(initialBounds);

    const onMapPress = useCallback<NonNullable<MapboxViewProps['onPress']>>(
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
