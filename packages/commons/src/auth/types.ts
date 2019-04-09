export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
  refresh: true;
}

export interface AuthPayload {
  success: boolean;
  error?: string;
  // Unique id to match server logs with client errors
  errorId?: string;
  // user id
  id?: string;
  // for mobile clients
  accessToken?: string;
  // for mobile clients
  refreshToken?: string;
}

export interface RefreshPayload {
  refreshToken: string;
}
