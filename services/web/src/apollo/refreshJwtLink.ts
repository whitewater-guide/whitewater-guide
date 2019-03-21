import { JWT_EXPIRED_CTX_KEY } from '@whitewater-guide/clients';
import { split } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { API_HOST } from '../environment';

export const refreshJwtLink = split(
  (operation) => operation.getContext()[JWT_EXPIRED_CTX_KEY],
  new TokenRefreshLink({
    isTokenValidOrUndefined: () => false,
    fetchAccessToken: () =>
      fetch(`${API_HOST}/auth/jwt/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ web: true }),
      }),
    handleFetch: () => {},
    handleResponse: () => () => ({ access_token: 'fake,see_cookies' }),
  }),
);
