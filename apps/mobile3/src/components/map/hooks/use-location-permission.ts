import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export enum LocationPermission {
  FETCHING,
  GRANTED,
  DENIED,
}

export function useLocationPermission(): LocationPermission {
  const [fetching, setFetching] = useState(true);
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    setFetching(true);
    Location.requestForegroundPermissionsAsync()
      .then((status) => setGranted(status.granted))
      .finally(() => setFetching(false));
  }, []);
  return granted
    ? LocationPermission.GRANTED
    : fetching
      ? LocationPermission.FETCHING
      : LocationPermission.DENIED;
}
