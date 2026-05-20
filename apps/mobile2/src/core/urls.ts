import { Platform } from 'react-native';
import Config from 'react-native-config';

function lh(host: string): string {
  return __DEV__ && Platform.OS === 'ios'
    ? host.replace('localhost:', '192.168.1.100:')
    : host;
}

export const BACKEND_URL = `${Config.BACKEND_PROTOCOL}://${lh(
  Config.BACKEND_HOST,
)}`;
export const WEB_URL = BACKEND_URL.replace('api.', '');
export const DEEP_LINKING_URL = `${Config.BACKEND_PROTOCOL}://${Config.DEEP_LINKING_DOMAIN}`;
