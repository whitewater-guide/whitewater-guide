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
import {
  RefreshBody,
  RefreshPayload,
  ResetBody,
  SignInBody,
} from '@whitewater-guide/commons';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';
import { BACKEND_URL } from '../../utils/urls';
import waitUntilActive from '../../utils/waitUntilActive';
import { tokenStorage } from './tokens';

export class MobileAuthService extends BaseAuthService {
  constructor(
    private readonly _resetApolloCache?: () => Promise<void>,
    private readonly _onSignOut?: () => void,
  ) {
    super(BACKEND_URL);
    LoginManager.setLoginBehavior(
      Platform.OS === 'ios' ? 'native' : 'native_with_fallback',
    );
    AppState.addEventListener('change', this.onAppStateChange);
  }

  async init() {
    await super.init();
    // Legacy check. If user is logged in via FB, but has no access token, then
    // most likely he logged in via legacy auth in older app version
    let fbToken: AccessToken | null = null;
    try {
      fbToken = await AccessToken.getCurrentAccessToken();
    } catch {}
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken && !!fbToken) {
      const resp = await this._get('/auth/facebook/signin', {
        access_token: fbToken.accessToken,
      });
      if (resp.accessToken) {
        await tokenStorage.setAccessToken(resp.accessToken);
      }
      if (resp.refreshToken) {
        await tokenStorage.setRefreshToken(resp.refreshToken);
      }
    }
  }

  onAppStateChange = (state: AppStateStatus) => {
    if (state === 'active' && !this.loading) {
      this.refreshAccessToken().catch();
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
    const resp = await this._post('/auth/jwt/refresh', req);
    const { success, accessToken, status, error, error_id } = resp;
    if (success && accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    } else if (status === 400) {
      Sentry.captureMessage('token refresh failed', {
        extra: { error, error_id },
      });
      // call internal function, so _loading status doesn't prevent it from running
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
      const result: LoginResult = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        return {
          success: false,
          error: { form: 'user_canceled' },
          status: 400,
        };
      }
      if (result.error) {
        Sentry.captureException(new Error('facebook sign in failed'));
        return { success: false, error: { form: result.error }, status: 400 };
      }
      // On real iOS device first backend login will fail
      // Probably because of this bug https://github.com/AFNetworking/AFNetworking/issues/4279
      // The app sends request when before it comes to foreground after fb login screen
      // Both initial delay and retry can solve this problem alone
      // After delay AppState.currentState is still `background`
      // After 1000ms (one retry) AppState.currentState is `active`
      await waitUntilActive(600);
      const at = await AccessToken.getCurrentAccessToken();
      if (!at) {
        Sentry.captureException(new Error('fb_access_token_not_found'));
        return {
          success: false,
          error: { form: 'fb_access_token_not_found' },
          status: 400,
        };
      }
      resp = await this._get('/auth/facebook/signin', {
        access_token: at.accessToken,
      });
    } else {
      resp = await this._post('/auth/local/signin', credentials);
    }
    await this.postSignIn(resp);
    return resp;
  }

  private async postSignIn(resp: AuthResponse<SignInBody>) {
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
    Sentry.setUserContext({ id });
    if (this._resetApolloCache) {
      await this._resetApolloCache();
    }
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', payload);
    await this.postSignIn(resp);
    return resp;
  }

  async signOut(force = false) {
    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    LoginManager.logOut();
    Sentry.setUserContext({});
    if (this._onSignOut) {
      this._onSignOut();
    }
    // resetApolloCache cannot be before resetNavigationToHome
    if (this._resetApolloCache) {
      await this._resetApolloCache();
    }
    return { success: true, status: 200 };
  }

  async requestReset(payload: RequestResetPayload): Promise<AuthResponse> {
    return this._post('/auth/local/reset/request', payload);
  }

  async requestVerification(
    payload: RequestVerificationPayload,
  ): Promise<AuthResponse> {
    const accessToken = await tokenStorage.getAccessToken();
    const opts = accessToken
      ? {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined;
    return this._post('/auth/local/verification/request', payload, opts);
  }

  async reset(payload: ResetPayload): Promise<AuthResponse<ResetBody>> {
    return this._post('/auth/local/reset', payload);
  }
}
