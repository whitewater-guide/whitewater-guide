import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import type { Coordinates } from '@/types/coordinates';

export async function openGoogleMaps(
  [lng, lat]: Coordinates,
  label?: string | null,
): Promise<void> {
  let directionsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
    if (canOpenGoogleMaps) {
      directionsURL = `comgooglemaps://?q=${lat},${lng}`;
    }
  } else {
    let geoURI = `geo:${lat},${lng}?q=${lat},${lng}`;
    if (label) {
      geoURI = `${geoURI}(${label})`;
    }
    const canOpen = await Linking.canOpenURL(geoURI);
    if (canOpen) {
      directionsURL = geoURI;
    }
  }
  Linking.openURL(directionsURL).catch(() => {
    /* Ignore */
  });
}
