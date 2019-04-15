import { JWT_EXPIRED_CTX_KEY } from '@whitewater-guide/clients';
import { split } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { history } from '../history';
import { refreshJWT } from './refreshJwt';

export const refreshJwtLink = split(
  (operation) => operation.getContext()[JWT_EXPIRED_CTX_KEY],
  new TokenRefreshLink({
    isTokenValidOrUndefined: () => false,
    fetchAccessToken: refreshJWT,
    handleFetch: () => {},
    handleResponse: () => (response: Response) => {
      if (response.ok) {
        return { access_token: 'fake,see_cookies' };
      }
      throw new Error('jwt refresh failed');
    },
    handleError: (error) => {
      history.replace('/regions');
    },
  }),
);
