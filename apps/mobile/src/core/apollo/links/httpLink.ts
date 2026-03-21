import { createHttpLink } from '@apollo/client/link/http';
import { Platform } from 'react-native';
import { getLocales } from 'react-native-localize';

import { BACKEND_URL } from '~/utils/urls';

const [{ languageCode }] = getLocales();

const { androidBuildNumber, iosBuildNumber } = require('../../../../app.json');
const buildNumber = Platform.OS === 'ios' ? iosBuildNumber : androidBuildNumber;

export const httpLink = createHttpLink({
  uri: `${BACKEND_URL}/graphql`,
  headers: {
    'Accept-Language': languageCode,
    'Cache-Control': 'no-store',
    'X-Client': `whitwater.guide/app/${Platform.OS}/v${PJSON_VERSION}(${buildNumber})`,
  },
  credentials: 'omit',
});
