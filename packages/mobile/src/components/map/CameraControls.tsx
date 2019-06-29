import Mapbox from '@react-native-mapbox-gl/maps';
import { getBBox } from '@whitewater-guide/clients';
import { Coordinate3d } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { Icon } from '../Icon';
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
  },
  secondIcon: {
    marginTop: theme.margin.single,
  },
});

interface Props {
  showUserLocation: boolean;
  initialBounds: Coordinate3d[];
}

const CameraControls: React.FC<Props> = React.memo(
  ({ showUserLocation, initialBounds }) => {
    const camera = useCamera();
    const onLocationPress = useCallback(() => {
      if (camera) {
        Mapbox.locationManager
          .getLastKnownLocation()
          .then((location) => {
            if (!location || !camera) {
              return;
            }
            const {
              coords: { latitude, longitude },
            } = location;
            camera.moveTo([longitude, latitude], 600);
          })
          .catch(() => {});
      }
    }, [camera]);
    const onBoundsPress = useCallback(() => {
      if (camera) {
        const [ne, sw] = getBBox(initialBounds);
        camera.fitBounds(ne, sw, theme.margin.single, 600);
      }
    }, [camera]);
    return (
      <View style={styles.container}>
        <Icon
          icon="crosshairs-gps"
          style={styles.icon}
          onPress={onLocationPress}
        />
        <Icon
          icon="crop-free"
          style={[styles.icon, showUserLocation && styles.secondIcon]}
          onPress={onBoundsPress}
        />
      </View>
    );
  },
);

CameraControls.displayName = 'MyLocationButton';

export default CameraControls;
