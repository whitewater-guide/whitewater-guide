import {
  AuthService,
  AuthType,
  Credentials,
  fetchRetry,
  refreshAccessToken,
} from '@whitewater-guide/clients';
import { AuthPayload } from '@whitewater-guide/commons';
import mitt from 'mitt';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';
import { BACKEND_URL } from '../../utils/urls';
import waitUntilActive from '../../utils/waitUntilActive';
import { tokenStorage } from './tokens';

type AuthEvent = 'signOut' | 'signIn' | 'forceSignOut';

const getFbRoute = ({ accessToken }: AccessToken) =>
  `${BACKEND_URL}/auth/facebook/signin?access_token=${accessToken}`;

interface Emitter {
  on(type: AuthEvent, handler: (payload: AuthPayload) => void): void;
  off(type: AuthEvent, handler: any): void;
  emit(type: 'signOut' | 'signIn'): void;
  emit(type: 'forceSignOut', payload: AuthPayload): void;
  emit(type: AuthEvent, payload?: AuthPayload): void;
}

export class MobileAuthService implements AuthService, Emitter {
  // ts in npm outdated, see github for correct ones
  // @ts-ignore
  private _emitter = mitt();
  private _refreshing = false;

  constructor() {
    LoginManager.setLoginBehavior(
      Platform.OS === 'ios' ? 'native' : 'native_with_fallback',
    );
    AppState.addEventListener('change', this.onAppStateChange);
  }

  async init() {
    // Legacy check. If user is logged in via FB, but has no access token, then
    // most likely he logged in via legacy auth in older app version
    let fbToken: AccessToken | null = null;
    try {
      fbToken = await AccessToken.getCurrentAccessToken();
    } catch {}
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken && !!fbToken) {
      await this.signInInternal(getFbRoute(fbToken));
    } else if (!!refreshToken) {
      await this.refreshAccessToken();
    }
  }

  onAppStateChange = (state: AppStateStatus) => {
    if (state === 'active' && !this._refreshing) {
      this.refreshAccessToken().catch();
    }
  };

  on(type: AuthEvent, handler: any) {
    this._emitter.on(type, handler);
  }

  off(type: AuthEvent, handler: any) {
    this._emitter.off(type, handler);
  }

  emit(type: AuthEvent, payload?: AuthPayload) {
    this._emitter.emit(type, payload);
  }

  async refreshAccessToken() {
    this._refreshing = true;
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return { success: false, status: 400 };
    }
    const resp = await refreshAccessToken(BACKEND_URL, {
      refreshToken,
    });
    const { success, accessToken, status, error, error_id } = resp;
    if (success && accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    } else if (status === 400) {
      Sentry.captureMessage('token refresh failed', { error, error_id });
      await this.signOut(true);
    }
    this._refreshing = false;
    return resp;
  }
  signIn(type: 'local', credentials: Credentials): Promise<void>;
  signIn(type: 'facebook'): Promise<void>;
  async signIn(type: AuthType, credentials?: Credentials): Promise<void> {
    let url!: string;
    if (type === 'facebook') {
      const result: LoginResult = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        return;
      }
      if (result.error) {
        Sentry.captureMessage('facebook sign in failed', {
          error: result.error,
        });
        return;
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
        return;
      }
      url = getFbRoute(at);
    }
    await this.signInInternal(url);
  }

  private async signInInternal(url: string, options?: RequestInit) {
    try {
      const resp = await fetchRetry(url, { credentials: 'omit', ...options });
      const payload: AuthPayload = await resp.json();
      const { accessToken, refreshToken } = payload;
      if (accessToken && refreshToken) {
        await tokenStorage.setAccessToken(accessToken);
        await tokenStorage.setRefreshToken(refreshToken);
        this.emit('signIn', payload);
      } else {
        Sentry.captureMessage('facebook sign in failed', payload);
      }
      // Alert.alert('fetching done', accessToken);
    } catch (e) {
      Sentry.captureException(e);
      // Alert.alert(e.message, JSON.stringify(e, null, 2));
    }
  }

  async signOut(force = false) {
    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    LoginManager.logOut();
    this.emit(force ? 'forceSignOut' : 'signOut');
  }
}
