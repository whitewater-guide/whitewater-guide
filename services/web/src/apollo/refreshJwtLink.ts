import { JWT_EXPIRED_CTX_KEY } from '@whitewater-guide/clients';
import { split } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { webAuthService } from '../auth';
import { history } from '../history';

export const refreshJwtLink = split(
  (operation) => operation.getContext()[JWT_EXPIRED_CTX_KEY],
  new TokenRefreshLink({
    isTokenValidOrUndefined: () => false,
    fetchAccessToken: async () => {
      const resp = await webAuthService.refreshAccessToken();
      return {
        status: resp.status,
        ok: resp.status >= 200 && resp.status < 300,
      } as any;
    },
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
