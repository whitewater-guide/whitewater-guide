import {
  AuthService,
  AuthType,
  Credentials,
  refreshAccessToken,
} from '@whitewater-guide/clients';
import { AuthPayload } from '@whitewater-guide/commons';
import mitt from 'mitt';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import { BACKEND_URL } from '../../utils/urls';
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
      const resp = await fetch(url, options);
      const { accessToken, refreshToken }: AuthPayload = await resp.json();
      if (accessToken && refreshToken) {
        await tokenStorage.setAccessToken(accessToken);
        await tokenStorage.setRefreshToken(refreshToken);
        this.emit('signIn');
      }
    } catch {}
  }
  async signOut(force = false) {
    await tokenStorage.setAccessToken(null);
    await tokenStorage.setRefreshToken(null);
    LoginManager.logOut();
    this.emit(force ? 'forceSignOut' : 'signOut');
  }
}
