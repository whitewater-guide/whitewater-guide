import { RefreshBody, ResetBody, SignInBody } from '@whitewater-guide/commons';
import { qs } from 'url-parse';

import { fetchRetry } from '../utils';
import { inflateError } from './inflateError';
import {
  AuthResponse,
  AuthType,
  Credentials,
  RegisterPayload,
  RequestResetPayload,
  RequestVerificationPayload,
  ResetPayload,
} from './types';

type Listener = (...args: any[]) => Promise<void> | void;

export type AuthServiceEvent = 'loading' | 'sign-out' | 'sign-in';

export interface AuthService {
  init(): Promise<void>;
  refreshAccessToken(): Promise<AuthResponse<RefreshBody>>;
  signIn(
    type: 'local',
    credentials: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  signIn(type: 'facebook' | 'apple'): Promise<AuthResponse<SignInBody>>;
  signIn(
    type: AuthType,
    credentials?: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  signOut(force?: boolean): Promise<AuthResponse>;
  signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>>;
  requestReset(payload: RequestResetPayload): Promise<AuthResponse>;
  reset(payload: ResetPayload): Promise<AuthResponse<ResetBody>>;
  requestVerification(
    payload: RequestVerificationPayload,
  ): Promise<AuthResponse>;

  on(
    e: 'loading',
    listener: (loading: boolean) => Promise<void> | void,
  ): () => void;
  on(
    e: 'sign-out',
    listener: (forced: boolean) => Promise<void> | void,
  ): () => void;
  on(
    e: 'sign-in',
    listener: (afterSignUp: boolean) => Promise<void> | void,
  ): () => void;
  off(e: AuthServiceEvent, listener?: Listener): void;
}

export abstract class BaseAuthService implements AuthService {
  protected readonly _baseUrl: string;
  protected readonly _credentials: RequestInit['credentials'];
  private _loading = false;
  private _listeners: Map<string | symbol, Listener[]> = new Map();
  private _initialized = false;
  private _refreshing: Promise<AuthResponse<RefreshBody>> | null = null;

  protected constructor(baseUrl: string, credentials?: boolean) {
    this._baseUrl = baseUrl;
    this._credentials = credentials ? 'include' : 'omit';
  }

  public on(event: AuthServiceEvent, listener: Listener): () => void {
    const listeners = this._listeners.get(event) || [];
    listeners.push(listener);
    this._listeners.set(event, listeners);
    return () => this.off(event, listener);
  }

  public off(event: AuthServiceEvent, listener?: Listener) {
    if (!listener) {
      this._listeners.delete(event);
      return;
    }
    const listeners = this._listeners.get(event) || [];
    this._listeners.set(
      event,
      listeners.filter((l) => l !== listener),
    );
  }

  protected async emit(event: AuthServiceEvent, ...payload: any[]) {
    const listeners = this._listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        await Promise.resolve(listener(...payload));
      }
    }
  }

  protected set loading(value: boolean) {
    if (this._loading !== value) {
      this._loading = value;
      this.emit('loading', value);
    }
  }

  protected get loading(): boolean {
    return this._loading;
  }

  private async _fetch(
    url: string,
    opts?: RequestInit,
  ): Promise<AuthResponse<any>> {
    if (!this._initialized) {
      throw new Error('auth service not initialized');
    }
    try {
      const res = await fetchRetry(url, opts);
      if (res.status >= 500) {
        return {
          success: false,
          error: {
            form: 'server_error',
          },
          status: res.status,
        };
      }
      const json = await res.json();
      return {
        ...json,
        error: inflateError(json.error),
        status: res.status,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          form: 'fetch_error',
          original: e,
        },
        status: 0,
      };
    }
  }

  protected async _post(
    url: string,
    payload?: any,
    opts?: RequestInit,
  ): Promise<AuthResponse<any>> {
    const { headers, credentials, ...options }: RequestInit = opts || {};
    return this._fetch(`${this._baseUrl}${url}`, {
      ...options,
      method: 'POST',
      credentials: credentials || this._credentials,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload || {}),
    });
  }

  protected async _get(
    url: string,
    payload: any,
    opts?: RequestInit,
  ): Promise<AuthResponse<any>> {
    const { credentials, ...options }: RequestInit = opts || {};

    return this._fetch(`${this._baseUrl}${url}?${qs.stringify(payload)}`, {
      ...options,
      method: 'GET',
      credentials: credentials || this._credentials,
    });
  }

  private async _callUnlessLoading(
    func: any,
    ...args: any
  ): Promise<AuthResponse<any>> {
    if (this._loading) {
      return Promise.resolve({
        success: false,
        error: { form: 'loading' },
        status: 0,
      });
    }
    this.loading = true;
    try {
      const result = await func.apply(this, args);
      return result;
    } finally {
      if (!this._refreshing) {
        this.loading = false;
      }
    }
  }

  private async _dedupeRefreshToken(func: any): Promise<AuthResponse<any>> {
    this.loading = true;
    if (this._refreshing) {
      return this._refreshing;
    }
    this._refreshing = func.apply(this).then(
      (resp: any) => {
        this._refreshing = null;
        this.loading = false;
        return resp;
      },
      () => {
        this._refreshing = null;
        this.loading = false;
      },
    );
    return this._refreshing!;
  }

  init(): Promise<void> {
    this.refreshAccessToken = this._dedupeRefreshToken.bind(
      this,
      this.refreshAccessToken,
    );
    this.signIn = this._callUnlessLoading.bind(this, this.signIn);
    const signOutUnlessLoading = this._callUnlessLoading.bind(
      this,
      this.signOut,
    );
    const forceSignOut = this.signOut.bind(this);
    this.signOut = (force: boolean) => {
      if (force) {
        return forceSignOut(true);
      } else {
        return signOutUnlessLoading(false);
      }
    };
    this.signUp = this._callUnlessLoading.bind(this, this.signUp);
    this.requestReset = this._callUnlessLoading.bind(this, this.requestReset);
    this.reset = this._callUnlessLoading.bind(this, this.reset);
    this.requestVerification = this._callUnlessLoading.bind(
      this,
      this.requestVerification,
    );
    this._initialized = true;
    return Promise.resolve();
  }

  abstract refreshAccessToken(): Promise<AuthResponse<RefreshBody>>;
  abstract signIn(
    type: 'local',
    credentials: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  abstract signIn(type: 'facebook'): Promise<AuthResponse<SignInBody>>;
  abstract signIn(
    type: AuthType,
    credentials?: Credentials,
  ): Promise<AuthResponse<SignInBody>>;
  abstract signOut(force?: boolean): Promise<AuthResponse>;
  abstract signUp(payload: RegisterPayload): Promise<AuthResponse<SignInBody>>;
  abstract requestReset(payload: RequestResetPayload): Promise<AuthResponse>;
  abstract reset(payload: ResetPayload): Promise<AuthResponse<ResetBody>>;
  abstract requestVerification(
    payload: RequestVerificationPayload,
  ): Promise<AuthResponse>;
}
