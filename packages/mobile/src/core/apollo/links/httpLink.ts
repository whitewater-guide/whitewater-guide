import { createHttpLink } from 'apollo-link-http';
import { getLocales } from 'react-native-localize';
import { BACKEND_URL } from '../../../utils/urls';

const [{ languageCode }] = getLocales();

export const httpLink = createHttpLink({
  uri: `${BACKEND_URL}/graphql`,
  headers: {
    'Accept-Language': languageCode,
    'Cache-Control': 'no-store',
  },
  credentials: 'omit',
});
