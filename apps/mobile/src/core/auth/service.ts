import appleAuth from '@invertase/react-native-apple-authentication';
import messaging from '@react-native-firebase/messaging';
import type {
  AuthResponse,
  AuthType,
  Credentials,
  RegisterPayload,
  RequestResetPayload,
  RequestVerificationPayload,
  ResetPayload,
} from '@whitewater-guide/clients';
import { BaseAuthService } from '@whitewater-guide/clients';
import type {
  RefreshBody,
  RefreshPayload,
  ResetBody,
  SignInBody,
} from '@whitewater-guide/commons';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';

import { BACKEND_URL } from '~/utils/urls';

import { tracker, trackError } from '../errors';
import { tokenStorage } from './tokens';

export class MobileAuthService extends BaseAuthService {
  private _fcmToken: string | null = null;

  private _fcmTokenSent = false;

  constructor() {
    super(BACKEND_URL);
    LoginManager.setLoginBehavior(
      Platform.OS === 'ios' ? 'browser' : 'native_with_fallback',
    );
  }

  async init() {
    await super.init();
    messaging()
      .getToken()
      .then((token: any) => {
        this._fcmToken = token;
      })
      .catch(() => {
        // We do not care if it fails
      });
    messaging().onTokenRefresh(this._sendFcmToken);
    AppState.addEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (state: AppStateStatus) => {
    if (state === 'active' && !this.loading) {
      this.refreshAccessToken().catch(() => {});
    }
  };

  async refreshAccessToken(): Promise<AuthResponse<RefreshBody>> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return {
        success: false,
        status: 400,
        error: { jwt: 'refresh_not_found' },
      };
    }
    const req: RefreshPayload = { refreshToken };
    const resp: AuthResponse<RefreshBody> = await this._post(
      '/auth/jwt/refresh',
      req,
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { success, accessToken, status, error } = resp;
    if (success && accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    } else if (status === 400) {
      trackError('auth', new Error('token refresh failed'), {
        error,
      });
      // call internal function, so _loading status doesn't prevent it from running
      await this.signOut(true);
    }
    if (!this._fcmTokenSent && this._fcmToken) {
      // no await on purpose
      messaging()
        .getToken()
        .then((token) => {
          this._sendFcmToken(token).catch(() => {});
          this._fcmTokenSent = true;
        })
        .catch(() => {});
    }
    tracker.setUser({ id: resp.id });
    return resp;
  }

  signIn(
    type: 'local',
    credentials: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  signIn(type: 'facebook' | 'apple'): Promise<AuthResponse<SignInBody>>;
  async signIn(
    type: AuthType,
    credentials?: Credentials,
  ): Promise<AuthResponse<SignInBody>> {
    let resp: AuthResponse<SignInBody>;
    if (type === 'facebook') {
      resp = await this.signInWithFacebook();
    } else if (type === 'apple') {
      resp = await this.signInWithApple();
    } else {
      resp = await this._post('/auth/local/signin', {
        ...credentials,
        fcm_token: this._fcmToken,
      });
    }
    await this.postSignIn(resp);
    this._fcmTokenSent = true;
    return resp;
  }

  private async signInWithFacebook(): Promise<AuthResponse<SignInBody>> {
    try {
      const result = await LoginManager.logInWithPermissions(
        ['public_profile', 'email'],
        // https://github.com/thebergamo/react-native-fbsdk-next#limited-login-ios
        // https://github.com/facebook/facebook-ios-sdk/issues/2148
        Platform.OS === 'ios' ? 'limited' : 'enabled',
      );

      if (result.isCancelled) {
        return {
          success: false,
          error: { form: 'user_canceled' },
          status: 400,
        };
      }

      const token: { access_token?: string; auth_token?: string } = {};

      // https://github.com/thebergamo/react-native-fbsdk-next#limited-login-ios
      // for limited login on ios, set auth_token, otherwise set access_token
      // on backend custom facebook passport strategy will delegate to substrategy based on which token we provide
      if (Platform.OS === 'ios') {
        const at = await AuthenticationToken.getAuthenticationTokenIOS();
        token.auth_token = at?.authenticationToken;
      } else {
        const at = await AccessToken.getCurrentAccessToken();
        if (!at?.accessToken) {
          trackError('auth', new Error('fb access token not found'), {
            provider: 'facebook',
          });
          return {
            success: false,
            error: { form: 'fb_access_token_not_found' },
            status: 400,
          };
        }
        token.access_token = at.accessToken;
      }

      const resp = await this._get('/auth/facebook/signin', {
        ...token,
        fcm_token: this._fcmToken,
      });
      return resp;
    } catch (error) {
      trackError('auth', error, { provider: 'facebook' });
      return { success: false, error: { form: error }, status: 400 };
    }
  }

  private async signInWithApple(): Promise<AuthResponse<SignInBody>> {
    try {
      const appleResp = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      return await this._post('/auth/apple/signin', {
        ...appleResp,
        fcm_token: this._fcmToken,
      });
    } catch (err: any) {
      if (err.code === appleAuth.Error.CANCELED) {
        return {
          success: false,
          error: { form: 'user_canceled' },
          status: 400,
        };
      }
      return { success: false, error: { form: err }, status: 400 };
    }
  }

  private async postSignIn(
    resp: AuthResponse<SignInBody>,
    _afterSignup = false,
  ) {
    const { success, id, accessToken, refreshToken } = resp;
    if (!success) {
      return;
    }
    if (accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    }
    if (refreshToken) {
      await tokenStorage.setRefreshToken(refreshToken);
    }
    await this.emit('sign-in', false);
    tracker.setUser({ id });
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', {
      ...payload,
      fcm_token: this._fcmToken,
    });
    await this.postSignIn(resp, true);
    return resp;
  }

  async signOut(force = false) {
    const opts = await this._getBearerHeader();
    // no await on purpose
    this._get('/auth/logout', { fcm_token: this._fcmToken }, opts).catch(() => {
      // there's nothing we can do really, continue to log out normally
    });

    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    try {
      LoginManager.logOut();
    } catch (e) {
      // ignore
    }
    tracker.setUser(null);
    await this.emit('sign-out', force);
    return { success: true, status: 200 };
  }

  async requestReset(payload: RequestResetPayload): Promise<AuthResponse> {
    return this._post('/auth/local/reset/request', payload);
  }

  async requestVerification(
    payload: RequestVerificationPayload,
  ): Promise<AuthResponse> {
    const opts = await this._getBearerHeader();
    return this._post('/auth/local/verification/request', payload, opts);
  }

  async reset(payload: ResetPayload): Promise<AuthResponse<ResetBody>> {
    return this._post('/auth/local/reset', payload);
  }

  private _getBearerHeader = async (): Promise<RequestInit | undefined> => {
    const accessToken = await tokenStorage.getAccessToken();
    return accessToken
      ? {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined;
  };

  private _sendFcmToken = async (fcm_token: string) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const old_fcm_token = fcm_token === this._fcmToken ? null : this._fcmToken;
    this._fcmToken = fcm_token;
    const opts = await this._getBearerHeader();
    if (fcm_token && opts) {
      this._post('/fcm/set', { fcm_token, old_fcm_token }, opts).catch(
        () => {},
      );
    }
  };
}
