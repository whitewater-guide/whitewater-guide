import { AuthBody, User } from '@whitewater-guide/commons';
import { Overwrite } from 'utility-types';

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

export type AuthResponse<T = {}> = T & {
  error?: { [key: string]: any };
  success: boolean;
  error_id?: string;
  status: number; // 0 indicates network error (fetch throws)
};

export interface WithMe {
  me: User | null;
}
