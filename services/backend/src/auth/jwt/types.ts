export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
  refresh: true;
}
