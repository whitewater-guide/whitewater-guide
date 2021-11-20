import Mapbox from '@react-native-mapbox-gl/maps';
import { getBBox } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

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
  rectButton: {
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
  if (!isGranted && Platform.OS === 'android') {
    isGranted = await Mapbox.requestAndroidLocationPermissions();
  }
  if (!isGranted) {
    return null;
  }
  if (AppState.currentState !== 'active') {
    return null;
  }
  try {
    const location = await Mapbox.locationManager.getLastKnownLocation();
    return location || null;
  } catch (e) {
    return null;
  }
};

const CameraControls: React.FC<Props> = React.memo(
  ({ locationPermissionGranted, initialBounds }) => {
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

    if (Platform.OS === 'ios') {
      return (
        <View style={styles.container}>
          <Icon
            icon="crosshairs-gps"
            style={styles.icon}
            onPress={onLocationPress}
          />
          {!!initialBounds && (
            <Icon
              icon="crop-free"
              style={[styles.icon, styles.secondIcon]}
              onPress={onBoundsPress}
            />
          )}
        </View>
      );
    }
    // TODO: works on android only: https://github.com/kmagiera/react-native-gesture-handler/pull/537
    return (
      <View style={styles.container}>
        <RectButton
          style={[styles.rectButton, styles.icon]}
          onPress={onLocationPress}
        >
          <Icon icon="crosshairs-gps" />
        </RectButton>
        {!!initialBounds && (
          <RectButton
            style={[styles.rectButton, styles.icon, styles.secondIcon]}
            onPress={onBoundsPress}
          >
            <Icon icon="crop-free" />
          </RectButton>
        )}
      </View>
    );
  },
);

CameraControls.displayName = 'MyLocationButton';

export default CameraControls;
