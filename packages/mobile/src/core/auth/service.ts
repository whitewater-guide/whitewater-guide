import messaging from '@react-native-firebase/messaging';
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
import { BACKEND_URL } from '../../utils/urls';
import waitUntilActive from '../../utils/waitUntilActive';
import { tracker, trackError } from '../errors';
import { tokenStorage } from './tokens';

export class MobileAuthService extends BaseAuthService {
  private _fcmToken: string | null = null;
  private _fcmTokenSent: boolean = false;

  constructor(
    private readonly _resetApolloCache?: () => Promise<void>,
    private readonly _onSignOut?: () => void,
  ) {
    super(BACKEND_URL);
    LoginManager.setLoginBehavior(
      Platform.OS === 'ios' ? 'browser' : 'native_with_fallback',
    );
  }

  async init() {
    await super.init();
    const pushEnabled = await messaging().hasPermission();
    if (pushEnabled) {
      // do not watch token change.
      // fcm token should be valid at startup and this is enough for now
      messaging()
        .getToken()
        .then((token: string) => {
          this._fcmToken = token;
        })
        .catch(() => {});
    }
    AppState.addEventListener('change', this.onAppStateChange);
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
      trackError(
        'auth',
        new Error('token refresh failed'),
        {
          error,
        },
        error_id,
      );
      // call internal function, so _loading status doesn't prevent it from running
      await this.signOut(true);
    }
    if (!this._fcmTokenSent && this._fcmToken) {
      // no await on purpose
      this._getBearerHeader()
        .then((opts) =>
          this._post('/fcm/set', { fcm_token: this._fcmToken }, opts),
        )
        .then(() => {
          this._fcmTokenSent = true;
        })
        .catch(() => {});
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
      const result: LoginResult = await LoginManager.logInWithPermissions([
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
        trackError('auth', new Error('facebook sign in failed'), {
          error: result.error,
        });
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
        trackError('auth', new Error('fb_access_token_not_found'));
        return {
          success: false,
          error: { form: 'fb_access_token_not_found' },
          status: 400,
        };
      }
      resp = await this._get('/auth/facebook/signin', {
        access_token: at.accessToken,
        fcm_token: this._fcmToken,
      });
    } else {
      resp = await this._post('/auth/local/signin', {
        ...credentials,
        fcm_token: this._fcmToken,
      });
    }
    await this.postSignIn(resp);
    return resp;
  }

  private async postSignIn(resp: AuthResponse<SignInBody>) {
    const { success, id, accessToken, refreshToken } = resp;
    if (!success) {
      return;
    }
    this._fcmTokenSent = true;
    if (accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    }
    if (refreshToken) {
      await tokenStorage.setRefreshToken(refreshToken);
    }
    tracker.setUser({ id });
    if (this._resetApolloCache) {
      await this._resetApolloCache();
    }
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>> {
    const resp = await this._post('/auth/local/signup', {
      ...payload,
      fcm_token: this._fcmToken,
    });
    await this.postSignIn(resp);
    return resp;
  }

  async signOut(force = false) {
    const opts = await this._getBearerHeader();
    // no await on purpose
    this._get('/auth/logout', { fcm_token: this._fcmToken }, opts).catch(
      () => {},
    );

    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    LoginManager.logOut();
    tracker.setUser(null);
    if (this._onSignOut) {
      this._onSignOut();
    }
    // resetApolloCache cannot be before resetNavigationToHome
    if (this._resetApolloCache) {
      await this._resetApolloCache();
    }
    this._fcmTokenSent = false;
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
}
