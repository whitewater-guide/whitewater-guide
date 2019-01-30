import { Coordinate } from '@whitewater-guide/commons';
import { Linking, Platform } from 'react-native';
import Firebase from 'react-native-firebase';

export const openGoogleMaps = async (coordinates: Coordinate) => {
  let directionsURL = `https://www.google.com/maps/search/?api=1&query=${
    coordinates[1]
  },${coordinates[0]}`;
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
    if (canOpenGoogleMaps) {
      directionsURL = `comgooglemaps://?q=${coordinates[1]},${coordinates[0]}`;
    }
    Firebase.analytics().setUserProperty(
      'canOpenGoogleMaps',
      canOpenGoogleMaps ? 'true' : 'false',
    );
  }
  Linking.openURL(directionsURL).catch(() => {
    /*Ignore*/
  });
};
