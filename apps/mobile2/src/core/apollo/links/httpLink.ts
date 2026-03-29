import { createHttpLink } from '@apollo/client/link/http';
import { Platform } from 'react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { getLocales } from 'react-native-localize';

import { BACKEND_URL } from '../../urls';

const [{ languageCode }] = getLocales();

const version = getVersion();
const buildNumber = getBuildNumber();

export const httpLink = createHttpLink({
  uri: `${BACKEND_URL}/graphql`,
  headers: {
    'Accept-Language': languageCode,
    'Cache-Control': 'no-store',
    'X-Client': `whitewater.guide/app/${Platform.OS}/v${version}(${buildNumber})`,
  },
  credentials: 'omit',
});
