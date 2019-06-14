import { ResetBody, SignInBody } from '@whitewater-guide/commons';
import {
  AuthResponse,
  AuthType,
  BaseAuthService,
  Credentials,
  RegisterPayload,
  RequestResetPayload,
  RequestVerificationPayload,
  ResetPayload,
} from '../../auth';
import { fbWebService } from './fb';

export class WebAuthService extends BaseAuthService {
  private _fbAppId: string;
  private _fbSdkPromise!: Promise<any>;
  private _onSignIn?: (resp: AuthResponse<SignInBody>) => Promise<void>;
  private _onSignOut?: (forced?: boolean) => Promise<void>;

  constructor(
    baseUrl: string,
    fbAppId: string,
    onSignIn?: (resp: AuthResponse<SignInBody>) => Promise<void>,
    onSignOut?: (forced?: boolean) => Promise<void>,
  ) {
    super(baseUrl, true);
    this._fbAppId = fbAppId;
    this._onSignIn = onSignIn;
    this._onSignOut = onSignOut;
  }

  async init() {
    await super.init();
    // Lazy load: do not await here, await where it is needed
    this._fbSdkPromise = fbWebService.loadSDK(this._fbAppId, 'en_US');
  }

  async refreshAccessToken() {
    const resp = await this._post('/auth/jwt/refresh', { web: true });
    if (!resp.success) {
      await this.signOut(true);
    }
    return resp;
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
      await this._fbSdkPromise;
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
      resp = await this._post('/auth/local/signin', credentials);
    }
    if (this._onSignIn) {
      await this._onSignIn(resp);
    }
    return resp;
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', payload);
    if (this._onSignIn) {
      await this._onSignIn(resp);
    }
    return resp;
  }

  async signOut(force = false) {
    await this._get(`/auth/logout`, undefined, {
      mode: 'no-cors',
    });
    await this._fbSdkPromise;
    try {
      //
      // const { status } = await fbWebService.getLoginStatus(true);
      // if (status === 'connected') {
      await fbWebService.logout();
      // }
    } catch (e) {
      // Ignore
    }
    if (this._onSignOut) {
      await this._onSignOut(force);
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
