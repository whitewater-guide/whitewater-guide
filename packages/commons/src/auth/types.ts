export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
  refresh: true;
}

export type AuthBody<T = unknown> = T & {
  success: boolean;
  error?: string;
  // Unique id to match server logs with client errors
  error_id?: string;
};

export interface ResetBody {
  // user id
  id?: string;
}

export interface RefreshBody {
  // user id
  id?: string;
  // for mobile clients
  accessToken?: string;
  // for mobile clients
  refreshToken?: string;
}

export interface SignInBody extends RefreshBody {
  // distinguish sign in and sign up
  isNew?: boolean;
}

export interface RefreshPayload {
  refreshToken: string;
}
