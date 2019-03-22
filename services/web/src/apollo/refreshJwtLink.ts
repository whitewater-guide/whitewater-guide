import { JWT_EXPIRED_CTX_KEY } from '@whitewater-guide/clients';
import { split } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { refreshJWT } from './refreshJwt';

export const refreshJwtLink = split(
  (operation) => operation.getContext()[JWT_EXPIRED_CTX_KEY],
  new TokenRefreshLink({
    isTokenValidOrUndefined: () => false,
    fetchAccessToken: refreshJWT,
    handleFetch: () => {},
    handleResponse: () => () => ({ access_token: 'fake,see_cookies' }),
  }),
);
