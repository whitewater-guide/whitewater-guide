import {
  AuthService,
  AuthType,
  Credentials,
  refreshAccessToken,
} from '@whitewater-guide/clients';
import { fbWebService } from '@whitewater-guide/clients/dist/web';
import { client } from '../apollo';
import { API_HOST, FACEBOOK_APP_ID } from '../environment';

class WebAuthService implements AuthService {
  async refreshAccessToken() {
    const response = await refreshAccessToken(API_HOST);
    return response;
  }
  signIn(type: 'local', credentials: Credentials): Promise<void>;
  signIn(type: 'facebook'): Promise<void>;
  async signIn(type: AuthType, credentials?: Credentials): Promise<void> {
    if (type === 'facebook') {
      await fbWebService.loadSDK(FACEBOOK_APP_ID, 'en_US');
      const { authResponse } = await fbWebService.login();
      if (!authResponse) {
        return;
      }
      const { accessToken } = authResponse;

      await fetch(
        `${API_HOST}/auth/facebook/signin?web=true&access_token=${accessToken}`,
        { credentials: 'include' },
      );
      await client.resetStore();
    }
  }
  async signOut(force = false) {
    await fetch(`${API_HOST}/auth/logout`, {
      credentials: 'include',
      mode: 'no-cors',
    });
    await client.resetStore();
    await fbWebService.loadSDK(FACEBOOK_APP_ID, 'en_US');
    const { status } = await fbWebService.getLoginStatus();
    if (status === 'connected') {
      await fbWebService.logout();
    }
  }
}

export const webAuthService = new WebAuthService();
