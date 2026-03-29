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

import { BACKEND_URL } from '../urls';
import { tokenStorage } from './tokens';

export class MobileAuthService extends BaseAuthService {
  constructor() {
    super(BACKEND_URL);
  }

  async init() {
    await super.init();
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
    const resp: AuthResponse<SignInBody> = await this._post(
      '/auth/local/signin',
      credentials,
    );
    await this.postSignIn(resp);
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
    const resp = await this._post('/auth/local/signup', payload);
    await this.postSignIn(resp);
    return resp;
  }

  async signOut(_force = false) {
    const opts = await this._getBearerHeader();
    this._get('/auth/logout', {}, opts).catch(() => {});

    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    await this.emit('sign-out', _force);
    return { success: true as const, status: 200 };
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
}
