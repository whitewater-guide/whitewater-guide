import Mapbox from '@rnmapbox/maps';
import { getBBox } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';

import theme from '../../theme';
import Icon from '../Icon';
import { useCamera } from './hooks';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: theme.margin.single,
    right: theme.margin.single,
  },
  icon: {
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: theme.rounding.single,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 3,
    ...theme.shadow,
    elevation: theme.elevation,
  },
  secondIcon: {
    marginTop: theme.margin.single,
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  locationPermissionGranted: boolean;
  initialBounds?: CodegenCoordinates[];
}

const maybeGetMyLocation = async (locationPermissionGranted: boolean) => {
  let isGranted = locationPermissionGranted;
  if (!isGranted) {
    return null;
  }
  if (AppState.currentState !== 'active') {
    return null;
  }
  try {
    const location = await Mapbox.locationManager.getLastKnownLocation();
    return location || null;
  } catch {
    return null;
  }
};

function CameraControls({ locationPermissionGranted, initialBounds }: Props) {
  const camera = useCamera();

  const onLocationPress = useCallback(() => {
    if (camera) {
      maybeGetMyLocation(locationPermissionGranted).then((location) => {
        if (location) {
          camera.moveTo(
            [location.coords.longitude, location.coords.latitude],
            600,
          );
        }
      });
    }
  }, [camera, locationPermissionGranted]);

  const onBoundsPress = useCallback(() => {
    if (camera && initialBounds) {
      const [ne, sw] = getBBox(initialBounds);
      camera.fitBounds(ne, sw, theme.margin.single, 600);
    }
  }, [camera, initialBounds]);

  return (
    <View style={styles.container}>
      <Pressable style={[styles.button, styles.icon]} onPress={onLocationPress}>
        <Icon icon="crosshairs-gps" narrow />
      </Pressable>
      {!!initialBounds && (
        <Pressable
          style={[styles.button, styles.icon, styles.secondIcon]}
          onPress={onBoundsPress}
        >
          <Icon icon="crop-free" narrow />
        </Pressable>
      )}
    </View>
  );
}

export default React.memo(CameraControls);
