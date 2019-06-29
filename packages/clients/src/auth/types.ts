import { AuthBody, Overwrite, User } from '@whitewater-guide/commons';

export interface TokenStorage {
  setAccessToken: (value: string | null) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  setRefreshToken: (value: string | null) => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
}

export type AuthType = 'local' | 'facebook';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  imperial?: boolean;
  language?: string;
}

export interface RequestResetPayload {
  email: string;
}

export interface RequestVerificationPayload {
  id: string;
}

export interface ResetPayload {
  id: string;
  token: string;
  password: string;
}

export type AuthResponse<T = {}> = Overwrite<
  AuthBody<T>,
  // this is for forms
  {
    error?: { [key: string]: any };
    status: number; // 0 indicates network error (fetch throws)
  }
>;

export interface WithMe {
  me: User | null;
}
