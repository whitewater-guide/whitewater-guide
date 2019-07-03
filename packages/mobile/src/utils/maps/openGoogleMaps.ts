import { Coordinate } from '@whitewater-guide/commons';
import { Linking, Platform } from 'react-native';
import Firebase from 'react-native-firebase';

export const openGoogleMaps = async ([lng, lat]: Coordinate) => {
  let directionsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
    if (canOpenGoogleMaps) {
      directionsURL = `comgooglemaps://?q=${lat},${lng}`;
    }
    Firebase.analytics().setUserProperty(
      'canOpenGoogleMaps',
      canOpenGoogleMaps ? 'true' : 'false',
    );
  } else {
    const canOpenGoogleMaps = await Linking.canOpenURL(
      `geo:0,0?q=${lat},${lng}`,
    );
    if (canOpenGoogleMaps) {
      directionsURL = `geo:0,0?q=${lat},${lng}`;
    }
  }
  Linking.openURL(directionsURL).catch(() => {
    /*Ignore*/
  });
};
