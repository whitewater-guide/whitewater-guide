import { Coordinate } from '@whitewater-guide/commons';
import { Linking, Platform } from 'react-native';
import Firebase from 'react-native-firebase';

export const openGoogleMaps = async ([lng, lat]: Coordinate) => {
  let directionsURL = `geo:${lat},${lng}`;
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
    directionsURL = canOpenGoogleMaps
      ? `comgooglemaps://?q=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Firebase.analytics().setUserProperty(
      'canOpenGoogleMaps',
      canOpenGoogleMaps ? 'true' : 'false',
    );
  }
  Linking.openURL(directionsURL).catch(() => {
    /*Ignore*/
  });
};
