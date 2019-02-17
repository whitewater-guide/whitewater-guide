import Config from 'react-native-config';

export const BACKEND_URL = `${Config.BACKEND_PROTOCOL}://${
  Config.BACKEND_HOST
}`;
