import { Platform } from 'react-native';
import Config from 'react-native-ultimate-config';

// workaround for local debugging on connected ios device
function lh(host: string): string {
  return __DEV__ && Platform.OS === 'ios'
    ? host.replace('localhost:', '192.168.1.100:')
    : host;
}

export const BACKEND_URL = `${Config.BACKEND_PROTOCOL}://${lh(
  Config.BACKEND_HOST,
)}`;
export const CHAT_URL = `${Config.BACKEND_PROTOCOL}://${lh(Config.CHAT_HOST)}`;
export const CHAT_DOMAIN = Config.CHAT_HOST.replace('synapse.', '');

export const WEB_URL = BACKEND_URL.replace('api.', '');
export const STATIC_CONTENT_URL_BASE = lh(Config.STATIC_CONTENT_URL_BASE);
export const DEEP_LINKING_URL = `${Config.BACKEND_PROTOCOL}://${Config.DEEP_LINKING_DOMAIN}`;
