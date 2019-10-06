import analytics from '@react-native-firebase/analytics';
import { Coordinate } from '@whitewater-guide/commons';
import { Linking, Platform } from 'react-native';

export const openGoogleMaps = async (
  [lng, lat]: Coordinate,
  label?: string | null,
) => {
  let directionsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
    if (canOpenGoogleMaps) {
      directionsURL = `comgooglemaps://?q=${lat},${lng}`;
    }
    analytics().setUserProperty(
      'canOpenGoogleMaps',
      canOpenGoogleMaps ? 'true' : 'false',
    );
  } else {
    let geoURI = `geo:${lat},${lng}?q=${lat},${lng}`;
    if (label) {
      geoURI = `${geoURI}(${label})`;
    }
    const canOpenGoogleMaps = await Linking.canOpenURL(geoURI);
    if (canOpenGoogleMaps) {
      directionsURL = geoURI;
    }
  }
  Linking.openURL(directionsURL).catch(() => {
    /*Ignore*/
  });
};
