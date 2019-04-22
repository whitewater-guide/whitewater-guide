import { AuthPayload } from '@whitewater-guide/commons';

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

export interface AuthResponse extends AuthPayload {
  status: number;
}
