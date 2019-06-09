import {
  AuthResponse,
  AuthType,
  BaseAuthService,
  Credentials,
  RegisterPayload,
  RequestResetPayload,
  RequestVerificationPayload,
  ResetPayload,
} from '@whitewater-guide/clients';
import { fbWebService } from '@whitewater-guide/clients/dist/web';
import { ResetBody, SignInBody } from '@whitewater-guide/commons';
import { client } from '../apollo';
import { API_HOST, FACEBOOK_APP_ID } from '../environment';

class WebAuthService extends BaseAuthService {
  constructor() {
    super(API_HOST, true);
  }

  refreshAccessToken() {
    return this._post('/auth/jwt/refresh', { web: true });
  }
  signIn(
    type: 'local',
    credentials: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  signIn(type: 'facebook'): Promise<AuthResponse<SignInBody>>;
  async signIn(
    type: AuthType,
    credentials?: Credentials,
  ): Promise<AuthResponse<SignInBody>> {
    let resp: AuthResponse<SignInBody>;
    if (type === 'facebook') {
      await fbWebService.loadSDK(FACEBOOK_APP_ID, 'en_US');
      const { authResponse } = await fbWebService.login();
      if (!authResponse) {
        return {
          success: false,
          error: { form: 'fb_login_failed' },
          status: 400,
        };
      }
      const { accessToken } = authResponse;

      resp = await this._get('/auth/facebook/signin', {
        access_token: accessToken,
        web: true,
      });
    } else {
      resp = {
        success: false,
        error: { form: 'local_auth_not_supported' },
        status: 400,
      };
    }
    await this.postSignIn();
    return resp;
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', payload);
    await this.postSignIn();
    return resp;
  }

  async postSignIn() {
    await client.resetStore();
  }

  async signOut(force = false) {
    await this._get(`/auth/logout`, undefined, {
      mode: 'no-cors',
    });
    await client.resetStore();
    await fbWebService.loadSDK(FACEBOOK_APP_ID, 'en_US');
    const { status } = await fbWebService.getLoginStatus();
    if (status === 'connected') {
      await fbWebService.logout();
    }
    return { success: true, status: 200 };
  }

  async requestReset(payload: RequestResetPayload): Promise<AuthResponse> {
    return this._post('/auth/local/reset/request', payload);
  }

  async requestVerification(
    payload: RequestVerificationPayload,
  ): Promise<AuthResponse> {
    return this._post('/auth/local/verification/request', payload);
  }

  async reset(payload: ResetPayload): Promise<AuthResponse<ResetBody>> {
    return this._post('/auth/local/reset', payload);
  }
}

export const webAuthService = new WebAuthService();
