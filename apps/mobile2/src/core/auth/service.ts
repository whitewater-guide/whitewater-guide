import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
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
import { AppState } from 'react-native';

import { tracker } from '../errors/tracker';
import { BACKEND_URL } from '../urls';
import { tokenStorage } from './tokens';

export class MobileAuthService extends BaseAuthService {
  private _fcmToken: string | null = null;
  private _fcmTokenSent = false;

  constructor() {
    super(BACKEND_URL);
  }

  async init() {
    await super.init();
    const messaging = getMessaging();
    getToken(messaging)
      .then((token) => {
        this._fcmToken = token;
      })
      .catch(() => {});
    onTokenRefresh(messaging, this._sendFcmToken);
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
    const { success, accessToken, status } = resp;
    if (success && accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    } else if (status === 400) {
      await this.signOut(true);
    }
    if (!this._fcmTokenSent && this._fcmToken) {
      getToken(getMessaging())
        .then((token) => {
          this._sendFcmToken(token).catch(() => {});
          this._fcmTokenSent = true;
        })
        .catch(() => {});
    }
    tracker.setUser({ id: (resp as any).id ?? null });
    return resp;
  }

  signIn(
    type: 'local',
    credentials: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  signIn(type: 'facebook' | 'apple'): Promise<AuthResponse<SignInBody>>;
  async signIn(
    _type: AuthType,
    credentials?: Credentials,
  ): Promise<AuthResponse<SignInBody>> {
    const resp: AuthResponse<SignInBody> = await this._post(
      '/auth/local/signin',
      { ...credentials, fcm_token: this._fcmToken },
    );
    await this.postSignIn(resp);
    this._fcmTokenSent = true;
    return resp;
  }

  private async postSignIn(resp: AuthResponse<SignInBody>) {
    const { success, accessToken, refreshToken } = resp;
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
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', {
      ...payload,
      fcm_token: this._fcmToken,
    });
    await this.postSignIn(resp);
    this._fcmTokenSent = true;
    return resp;
  }

  async signOut(_force = false) {
    const opts = await this._getBearerHeader();
    this._get('/auth/logout', { fcm_token: this._fcmToken }, opts).catch(
      () => {},
    );

    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    tracker.setUser(null);
    await this.emit('sign-out', _force);
    return { success: true as const, status: 200 };
  }

  private _sendFcmToken = async (fcm_token: string) => {
    const old_fcm_token = fcm_token === this._fcmToken ? null : this._fcmToken;
    this._fcmToken = fcm_token;
    const opts = await this._getBearerHeader();
    if (fcm_token && opts) {
      this._post('/fcm/set', { fcm_token, old_fcm_token }, opts).catch(
        () => {},
      );
    }
  };

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
}
