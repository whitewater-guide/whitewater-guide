import Config from 'react-native-ultimate-config';

export const BACKEND_URL = `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}`;

export const WEB_URL = BACKEND_URL.replace('api.', '');
export const DEEP_LINKING_URL = `${Config.BACKEND_PROTOCOL}://${Config.DEEP_LINKING_DOMAIN}`;
