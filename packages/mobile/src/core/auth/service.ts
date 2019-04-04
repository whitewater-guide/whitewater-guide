import {
  AuthService,
  AuthType,
  Credentials,
  fetchRetry,
  refreshAccessToken,
} from '@whitewater-guide/clients';
import { AuthPayload } from '@whitewater-guide/commons';
import mitt from 'mitt';
import { Alert, Platform } from 'react-native';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { BACKEND_URL } from '../../utils/urls';
import waitUntilActive from '../../utils/waitUntilActive';
import { tokenStorage } from './tokens';

type AuthEvent = 'signOut' | 'signIn' | 'forceSignOut';

interface Emitter {
  on(type: 'signOut' | 'signIn', handler: () => void): void;
  on(type: 'forceSignOut', handler: (payload: AuthPayload) => void): void;
  on(type: AuthEvent, handler: any): void;
  off(type: AuthEvent, handler: any): void;
  emit(type: 'signOut' | 'signIn'): void;
  emit(type: 'forceSignOut', payload: AuthPayload): void;
  emit(type: AuthEvent, payload?: AuthPayload): void;
}

export class MobileAuthService implements AuthService, Emitter {
  // ts in npm outdated, see github for correct ones
  // @ts-ignore
  private _emitter = mitt();

  constructor() {
    LoginManager.setLoginBehavior(
      Platform.OS === 'ios' ? 'native' : 'native_with_fallback',
    );
  }

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
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return { success: false, status: 400 };
    }
    const resp = await refreshAccessToken(BACKEND_URL, {
      refreshToken,
    });
    const { success, accessToken, status } = resp;
    if (success && accessToken) {
      await tokenStorage.setAccessToken(accessToken);
    } else if (status === 400) {
      await this.signOut(true);
    }
    return resp;
  }
  signIn(type: 'local', credentials: Credentials): Promise<void>;
  signIn(type: 'facebook'): Promise<void>;
  async signIn(type: AuthType, credentials?: Credentials): Promise<void> {
    let url!: string;
    let options!: RequestInit;
    if (type === 'facebook') {
      const result: LoginResult = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);
      if (result.error || result.isCancelled) {
        return;
      }
      // On real iOS device first backend login will fail
      // Probably because of this bug https://github.com/AFNetworking/AFNetworking/issues/4279
      // The app sends request when before it comes to foreground after fb login screen
      // Both initial delay and retry can solve this problem alone
      // After delay AppState.currentState is still `background`
      // After 1000ms (one retry) AppState.currentState is `active`
      await waitUntilActive();
      const at = await AccessToken.getCurrentAccessToken();
      if (!at) {
        return;
      }
      url = `${BACKEND_URL}/auth/facebook/signin?access_token=${
        at.accessToken
      }`;
      options = { credentials: 'omit' };
    }
    try {
      const resp = await fetchRetry(url, options);
      const { accessToken, refreshToken }: AuthPayload = await resp.json();
      if (accessToken && refreshToken) {
        await tokenStorage.setAccessToken(accessToken);
        await tokenStorage.setRefreshToken(refreshToken);
        this.emit('signIn');
      }
    } catch (e) {
      Alert.alert(e.message, JSON.stringify(e, null, 2));
    }
  }
  async signOut(force = false) {
    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    LoginManager.logOut();
    this.emit(force ? 'forceSignOut' : 'signOut');
  }
}
