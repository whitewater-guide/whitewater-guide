import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export enum LocationPermission {
  FETCHING,
  GRANTED,
  DENIED,
}

export const useLocationPermission = () => {
  const [fetching, setFetching] = useState(Platform.OS !== 'ios');
  const [granted, setGranted] = useState(Platform.OS === 'ios');
  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }
    setFetching(true);
    Mapbox.requestAndroidLocationPermissions()
      .then((isGranted: boolean) => setGranted(isGranted))
      .finally(() => setFetching(false));
  }, []);
  return granted
    ? LocationPermission.GRANTED
    : fetching
    ? LocationPermission.FETCHING
    : LocationPermission.DENIED;
};
